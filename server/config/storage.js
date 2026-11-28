const { randomUUID } = require("node:crypto");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const cloudinary = require("./cloudinary");

// Matches ACellPortal Cloudflare Worker caching rules for immutable UUID keys.
const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, s-maxage=31536000, immutable";

let cachedClient = null;
let cachedConfigKey = "";

function getR2Endpoint() {
  if (process.env.R2_ENDPOINT) {
    return process.env.R2_ENDPOINT.replace(/\/+$/, "");
  }
  if (process.env.R2_ACCOUNT_ID) {
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  return "";
}

function getKeyPrefix() {
  return String(process.env.R2_KEY_PREFIX || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

function isR2Configured() {
  return Boolean(
    getR2Endpoint() &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME,
  );
}

function getR2Client() {
  const endpoint = getR2Endpoint();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
  const configKey = `${endpoint}|${accessKeyId}|${secretAccessKey}`;

  if (!cachedClient || cachedConfigKey !== configKey) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
    cachedConfigKey = configKey;
  }
  return cachedClient;
}

function buildObjectKey(folder, objectId, extension) {
  const cleanFolder = String(folder || "yearbook").replace(/^\/+|\/+$/g, "");
  const prefix = getKeyPrefix();
  const base = prefix && !cleanFolder.startsWith(`${prefix}/`) && cleanFolder !== prefix
    ? `${prefix}/${cleanFolder}`
    : cleanFolder;
  return `${base}/${objectId}${extension}`;
}

function extractR2Key(keyOrUrl) {
  if (!keyOrUrl || typeof keyOrUrl !== "string") return null;
  const trimmed = keyOrUrl.trim();
  if (!trimmed || trimmed.startsWith(".") || trimmed.startsWith("/")) return null;
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed;
  }

  try {
    const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
    if (publicBase && trimmed.startsWith(`${publicBase}/`)) {
      return decodeURIComponent(trimmed.slice(publicBase.length + 1));
    }

    const parsed = new URL(trimmed);
    let key = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");
    const bucketName = process.env.R2_BUCKET_NAME;
    if (bucketName && key.startsWith(`${bucketName}/`)) {
      key = key.slice(bucketName.length + 1);
    }
    return key || null;
  } catch {
    return null;
  }
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
  const key = buildObjectKey(folder, objectId, extension);

  if (isR2Configured()) {
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: IMMUTABLE_CACHE_CONTROL,
    });
    await client.send(command);
    const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
    const url = publicBase
      ? `${publicBase}/${key}`
      : `${getR2Endpoint()}/${process.env.R2_BUCKET_NAME}/${key}`;
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
    const key = extractR2Key(keyOrUrl);
    if (!key) return;
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
  IMMUTABLE_CACHE_CONTROL,
  uploadImage,
  deleteImage,
  extractR2Key,
  isR2Configured,
};
