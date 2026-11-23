const { randomUUID } = require("node:crypto");
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

function detectImage(buffer) {
  if (buffer.length >= 4 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])))
    return ["image/jpeg", ".jpg"];
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex")))
    return ["image/png", ".png"];
  if (buffer.length >= 13 && /^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6)))
    return ["image/gif", ".gif"];
  if (buffer.length >= 20 && buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP")
    return ["image/webp", ".webp"];
  throw Object.assign(new Error("Upload a JPEG, PNG, GIF, or WebP image"), { status: 415 });
}

async function uploadImage(buffer, { folder = "yearbook" } = {}) {
  const [mimeType, extension] = detectImage(buffer);
  const objectId = `${Date.now()}-${randomUUID()}`;
  const key = `${folder}/${objectId}${extension}`;

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
        public_id: objectId,
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
