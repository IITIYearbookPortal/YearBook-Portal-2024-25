#!/usr/bin/env node
/**
 * Safe Index Migration Tool
 *
 * Provides three modes:
 *   --preflight : (Read-only) Verifies data readiness before creating full unique indexes.
 *   --rollout   : Creates full unique index on Users.roll_no and sparse unique on Auth.googleSubject.
 *   --rollback  : Drops unique indexes and restores previous index configuration.
 */

const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

async function main() {
  const mode = process.argv[2];
  if (!["--preflight", "--rollout", "--rollback"].includes(mode)) {
    console.log("Usage: node server/scripts/migrate-indexes.js <--preflight|--rollout|--rollback>");
    process.exit(1);
  }

  const uri = process.env.MONGODB_LINK;
  if (!uri) {
    console.error("❌ MONGODB_LINK is not configured.");
    process.exit(1);
  }

  let connection;
  try {
    connection = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 5000 }).asPromise();
    const db = connection.db;
    const Users = db.collection("users");
    const Auth = db.collection("auths");

    if (mode === "--preflight") {
      console.log("=== PREFLIGHT INDEX AUDIT (READ ONLY) ===");
      const dupRolls = await Users.aggregate([
        { $match: { roll_no: { $type: "string", $regex: /\S/ } } },
        { $group: { _id: "$roll_no", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ]).toArray();

      const dupSubjects = await Auth.aggregate([
        { $match: { googleSubject: { $type: "string", $regex: /\S/ } } },
        { $group: { _id: "$googleSubject", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ]).toArray();

      console.log(`Duplicate roll_no count:      ${dupRolls.length}`);
      console.log(`Duplicate googleSubject count: ${dupSubjects.length}`);

      if (dupRolls.length === 0 && dupSubjects.length === 0) {
        console.log("✅ PREFLIGHT PASSED: Rollout of full unique indexes is safe.");
      } else {
        console.error("❌ PREFLIGHT FAILED: Duplicate records exist. Do not proceed with rollout.");
        process.exitCode = 1;
      }
    } else if (mode === "--rollout") {
      console.log("=== EXECUTING INDEX ROLLOUT ===");
      console.log("Creating unique index on Users.roll_no...");
      await Users.createIndex({ roll_no: 1 }, { unique: true, background: true, name: "roll_no_1" });
      console.log("Creating sparse unique index on Auth.googleSubject...");
      await Auth.createIndex({ googleSubject: 1 }, { unique: true, sparse: true, background: true, name: "googleSubject_1" });
      console.log("✅ ROLLOUT COMPLETE: Unique indexes successfully built.");
    } else if (mode === "--rollback") {
      console.log("=== EXECUTING INDEX ROLLBACK ===");
      try {
        await Users.dropIndex("roll_no_1");
        console.log("Dropped Users roll_no_1 index.");
      } catch (e) {
        console.log("Users roll_no_1 index was not present or already dropped.");
      }
      try {
        await Auth.dropIndex("googleSubject_1");
        console.log("Dropped Auth googleSubject_1 index.");
      } catch (e) {
        console.log("Auth googleSubject_1 index was not present or already dropped.");
      }
      console.log("Re-applying partial enrollment index on Users.roll_no...");
      await Users.createIndex(
        { roll_no: 1 },
        { unique: true, partialFilterExpression: { indexedEnrollment: true }, name: "roll_no_1_partial" },
      );
      console.log("✅ ROLLBACK COMPLETE: Reverted to partial index.");
    }
  } catch (err) {
    console.error("❌ Migration error:", err.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

if (require.main === module) main();

module.exports = { main };
