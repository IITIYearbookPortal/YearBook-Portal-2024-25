#!/usr/bin/env node
/**
 * Plug-and-play R2 prefix manager for isolated cleanup & bucket transfer.
 *
 * Usage:
 *   node scripts/r2-media.js list
 *   node scripts/r2-media.js purge --yes
 *   node scripts/r2-media.js migrate --dest-bucket=... --dest-endpoint=... [--dest-access-key=...] [--dest-secret-key=...] [--dest-prefix=...] [--yes]
 */

const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { IMMUTABLE_CACHE_CONTROL } = require("../config/storage");

function parseFlags(argv) {
  const out = { _: [] };
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq === -1) out[arg.slice(2)] = true;
      else out[arg.slice(2, eq)] = arg.slice(eq + 1);
    } else {
      out._.push(arg);
    }
  }
  return out;
}

function makeClient(endpoint, accessKeyId, secretAccessKey) {
  return new S3Client({
    region: "auto",
    endpoint: endpoint.replace(/\/+$/, ""),
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function listPrefixedObjects(client, bucket, prefix) {
  const keys = [];
  let ContinuationToken;
  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${prefix}/`, ContinuationToken }),
    );
    for (const obj of res.Contents || []) {
      keys.push({ key: obj.Key, size: obj.Size || 0 });
    }
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  const cmd = flags._[0] || "list";

  const srcEndpoint =
    process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const srcBucket = process.env.R2_BUCKET_NAME;
  const prefix = String(flags.prefix || process.env.R2_KEY_PREFIX || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!srcBucket || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 source credentials are missing in server/.env");
  }
  if (!prefix) {
    throw new Error("Refusing to operate without a non-empty R2_KEY_PREFIX (protects shared bucket)");
  }

  const srcClient = makeClient(srcEndpoint, process.env.R2_ACCESS_KEY_ID, process.env.R2_SECRET_ACCESS_KEY);
  const objects = await listPrefixedObjects(srcClient, srcBucket, prefix);

  if (cmd === "list") {
    const totalKb = (objects.reduce((s, o) => s + o.size, 0) / 1024).toFixed(1);
    console.log(`Found ${objects.length} object(s) (${totalKb} KB) under s3://${srcBucket}/${prefix}/`);
    for (const o of objects) console.log(`  ${o.key} (${o.size} B)`);
    return;
  }

  if (cmd === "purge") {
    if (!flags.yes) {
      console.log(`Dry run: ${objects.length} object(s) under s3://${srcBucket}/${prefix}/ would be deleted. Pass --yes to confirm.`);
      return;
    }
    for (let i = 0; i < objects.length; i += 1000) {
      const batch = objects.slice(i, i + 1000).map((o) => ({ Key: o.key }));
      if (batch.length) {
        await srcClient.send(new DeleteObjectsCommand({ Bucket: srcBucket, Delete: { Objects: batch } }));
      }
    }
    console.log(`Deleted ${objects.length} object(s) under s3://${srcBucket}/${prefix}/`);
    return;
  }

  if (cmd === "migrate") {
    const destBucket = flags["dest-bucket"];
    const destEndpoint = flags["dest-endpoint"] || srcEndpoint;
    const destAccessKey = flags["dest-access-key"] || process.env.R2_ACCESS_KEY_ID;
    const destSecretKey = flags["dest-secret-key"] || process.env.R2_SECRET_ACCESS_KEY;
    const destPrefix = flags["dest-prefix"] !== undefined
      ? String(flags["dest-prefix"]).trim().replace(/^\/+|\/+$/g, "")
      : prefix;

    if (!destBucket) throw new Error("--dest-bucket is required");
    if (!flags.yes) {
      console.log(`Dry run: ${objects.length} object(s) would copy from ${srcBucket}/${prefix}/ to ${destBucket}/${destPrefix ? destPrefix + "/" : ""}. Pass --yes to copy.`);
      return;
    }

    const destClient = makeClient(destEndpoint, destAccessKey, destSecretKey);
    for (const { key } of objects) {
      const relKey = key.slice(prefix.length + 1);
      const targetKey = destPrefix ? `${destPrefix}/${relKey}` : relKey;
      const obj = await srcClient.send(new GetObjectCommand({ Bucket: srcBucket, Key: key }));
      const body = Buffer.from(await obj.Body.transformToByteArray());
      await destClient.send(
        new PutObjectCommand({
          Bucket: destBucket,
          Key: targetKey,
          Body: body,
          ContentType: obj.ContentType || "application/octet-stream",
          CacheControl: obj.CacheControl || IMMUTABLE_CACHE_CONTROL,
        }),
      );
      console.log(`Copied ${key} -> ${destBucket}/${targetKey}`);
    }
    console.log(`Migrated ${objects.length} object(s) cleanly.`);
    return;
  }

  throw new Error(`Unknown command: ${cmd}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
