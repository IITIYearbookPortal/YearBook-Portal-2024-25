const test = require("node:test");
const assert = require("node:assert/strict");

const R2_ENV_KEYS = [
  "R2_ENDPOINT",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
  "R2_KEY_PREFIX",
];

function clearR2Env() {
  for (const k of R2_ENV_KEYS) delete process.env[k];
}

function restoreEnv(origEnv) {
  for (const k of R2_ENV_KEYS) {
    if (origEnv[k] !== undefined) process.env[k] = origEnv[k];
    else delete process.env[k];
  }
}

test("Cloudflare R2 storage: checks image content and creates distinct object keys", async () => {
  const origEnv = { ...process.env };
  try {
    clearR2Env();
    process.env.R2_ACCOUNT_ID = "test-account-id";
    process.env.R2_ACCESS_KEY_ID = "test-access-key";
    process.env.R2_SECRET_ACCESS_KEY = "test-secret-key";
    process.env.R2_BUCKET_NAME = "yearbook-test-bucket";
    process.env.R2_PUBLIC_URL = "https://cdn.yearbook.example.com";

    // Clear require cache for storage module to pick up env
    delete require.cache[require.resolve("../config/storage")];
    const storage = require("../config/storage");

    assert.equal(storage.isR2Configured(), true);

    // Mock S3Client
    const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
    let sentCommands = [];
    const origSend = S3Client.prototype.send;
    S3Client.prototype.send = async function (cmd) {
      sentCommands.push(cmd);
      return {};
    };

    try {
      const buffer = Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), Buffer.alloc(16)]);
      await assert.rejects(storage.uploadImage(Buffer.from("text document")), { status: 415 });
      assert.equal(sentCommands.length, 0);
      const beforeTime = Date.now();
      const res = await storage.uploadImage(buffer, {
        folder: "yearbook/profiles",
      });
      const afterTime = Date.now();

      assert.equal(sentCommands.length, 1);
      const putCmd = sentCommands[0];
      assert.ok(putCmd instanceof PutObjectCommand);
      assert.equal(putCmd.input.Bucket, "yearbook-test-bucket");
      assert.equal(putCmd.input.ContentType, "image/png");
      assert.equal(putCmd.input.CacheControl, storage.IMMUTABLE_CACHE_CONTROL);
      assert.equal(putCmd.input.Body, buffer);

      const key = putCmd.input.Key;
      assert.ok(key.startsWith("yearbook/profiles/"), `Unexpected key prefix: ${key}`);
      assert.ok(key.endsWith(".png"), `Unexpected key extension: ${key}`);
      const filenamePart = key.slice("yearbook/profiles/".length, -4);
      assert.match(
        filenamePart,
        /^\d+-[a-f0-9-]{36}$/,
      );
      const keyTimestamp = Number(filenamePart.split("-")[0]);
      assert.ok(
        keyTimestamp >= beforeTime && keyTimestamp <= afterTime,
        `Timestamp ${keyTimestamp} out of range [${beforeTime}, ${afterTime}]`,
      );

      assert.equal(res.public_id, key);
      assert.equal(res.url, `https://cdn.yearbook.example.com/${key}`);
      const second = await storage.uploadImage(buffer, { folder: "yearbook/profiles" });
      assert.notEqual(second.public_id, res.public_id);

      // Test deleteImage via public URL
      sentCommands = [];
      await storage.deleteImage(res.url);
      assert.equal(sentCommands.length, 1);
      const delCmd = sentCommands[0];
      assert.ok(delCmd instanceof DeleteObjectCommand);
      assert.equal(delCmd.input.Bucket, "yearbook-test-bucket");
      assert.equal(delCmd.input.Key, key);

      // Test deleteImage via raw key
      sentCommands = [];
      await storage.deleteImage(key);
      assert.equal(sentCommands.length, 1);
      assert.equal(sentCommands[0].input.Key, key);
      // Test optional R2_KEY_PREFIX isolation
      process.env.R2_KEY_PREFIX = "yearbook-portal";
      sentCommands = [];
      const prefixed = await storage.uploadImage(buffer, { folder: "yearbook/profiles" });
      assert.ok(prefixed.public_id.startsWith("yearbook-portal/yearbook/profiles/"));
      assert.equal(prefixed.url, `https://cdn.yearbook.example.com/${prefixed.public_id}`);
      delete process.env.R2_KEY_PREFIX;
    } finally {
      S3Client.prototype.send = origSend;
    }
  } finally {
    restoreEnv(origEnv);
    delete require.cache[require.resolve("../config/storage")];
  }
});

test("Cloudflare R2 storage: falls back to Cloudinary when R2 is unconfigured", async () => {
  const origEnv = { ...process.env };
  try {
    clearR2Env();

    delete require.cache[require.resolve("../config/storage")];
    const storage = require("../config/storage");

    assert.equal(storage.isR2Configured(), false);

    const cloudinary = require("../config/cloudinary");
    let uploadStreamOptions = null;
    let destroyedId = null;

    const origUploadStream = cloudinary.uploader.upload_stream;
    const origDestroy = cloudinary.uploader.destroy;

    cloudinary.uploader.upload_stream = function (opts, cb) {
      uploadStreamOptions = opts;
      const { PassThrough } = require("node:stream");
      const pt = new PassThrough();
      pt.on("finish", () => {
        cb(null, {
          secure_url: `https://res.cloudinary.com/test/image/upload/v1234/${opts.folder}/${opts.public_id}.jpg`,
          public_id: `${opts.folder}/${opts.public_id}`,
        });
      });
      return pt;
    };

    cloudinary.uploader.destroy = async function (publicId) {
      destroyedId = publicId;
      return { result: "ok" };
    };

    try {
      const buffer = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
      const res = await storage.uploadImage(buffer, { folder: "yearbook/signup" });

      assert.match(
        uploadStreamOptions.public_id,
        /^\d+-[a-f0-9-]{36}$/,
      );
      assert.equal(uploadStreamOptions.folder, "yearbook/signup");
      assert.ok(res.url.includes("yearbook/signup"));

      // Test delete
      await storage.deleteImage(res.url);
      assert.equal(destroyedId, `yearbook/signup/${uploadStreamOptions.public_id}`);
    } finally {
      cloudinary.uploader.upload_stream = origUploadStream;
      cloudinary.uploader.destroy = origDestroy;
    }
  } finally {
    restoreEnv(origEnv);
    delete require.cache[require.resolve("../config/storage")];
  }
});
