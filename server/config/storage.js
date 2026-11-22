const path = require("node:path");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const cloudinary = require("./cloudinary");

let s3Client = null;

function isR2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME,
  );
}

function getR2Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

/**
 * Uploads an image buffer to Cloudflare R2 (or fallback Cloudinary).
 * Strict requirement: only a timestamp (never the original file name) is used.
 */
async function uploadImage(
  buffer,
  { folder = "yearbook", mimeType = "image/jpeg", ext = ".jpg", index = 0 } = {},
) {
  // Only timestamp - never original name
  const timestamp = Date.now() + (index > 0 ? `_${index}` : "");
  const extension = ext ? (ext.startsWith(".") ? ext : `.${ext}`) : ".jpg";
  const key = `${folder}/${timestamp}${extension}`;

  if (isR2Configured()) {
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });
    await client.send(command);
    const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
    const url = publicBase
      ? `${publicBase}/${key}`
      : `https://${process.env.R2_BUCKET_NAME}.r2.cloudflarestorage.com/${key}`;
    return { url, public_id: key };
  }

  // Cloudinary fallback
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: String(timestamp), // only timestamp
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      },
    );
    require("streamifier").createReadStream(buffer).pipe(stream);
  });
}

/**
 * Deletes an image from Cloudflare R2 (or fallback Cloudinary) by key or URL.
 */
async function deleteImage(keyOrUrl) {
  if (!keyOrUrl || typeof keyOrUrl !== "string") return;

  if (isR2Configured()) {
    let key = keyOrUrl;
    if (key.startsWith("http://") || key.startsWith("https://")) {
      const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
      if (publicBase && key.startsWith(publicBase)) {
        key = key.slice(publicBase.length).replace(/^\/+/, "");
      } else {
        const urlObj = new URL(key);
        key = urlObj.pathname.replace(/^\/+/, "");
      }
    }
    const client = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    return client.send(command).catch(() => {});
  }

  // Cloudinary fallback
  let publicId = keyOrUrl;
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    const uploadIndex = publicId.indexOf("/upload/");
    if (uploadIndex !== -1) {
      const pathWithVersion = publicId.slice(uploadIndex + 8);
      const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, "");
      publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");
    }
  }
  return cloudinary.uploader.destroy(publicId).catch(() => {});
}

module.exports = {
  uploadImage,
  deleteImage,
  isR2Configured,
};
