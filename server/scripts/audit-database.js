#!/usr/bin/env node
/**
 * Read-Only Database Security & Migration Audit Script
 *
 * Aggregate-only inspection of MongoDB collections and index definitions.
 * Outputs strictly counts and summary metrics. Zero PII or record IDs.
 * Non-zero exit code on failure, guaranteed connection cleanup in finally.
 */

const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

function formatIndex(idx) {
  return {
    name: idx.name,
    key: idx.key,
    unique: Boolean(idx.unique),
    sparse: Boolean(idx.sparse),
    partialFilterExpression: idx.partialFilterExpression || null,
  };
}

async function inspectIndexes(collection) {
  try {
    const raw = await collection.listIndexes().toArray();
    return raw.map(formatIndex);
  } catch (err) {
    return [{ error: err.message }];
  }
}

async function runAudit(db) {
  const report = {};

  // ==========================================
  // 1. AUTH COLLECTION AUDIT
  // ==========================================
  const Auth = db.collection("auths");
  const totalAuth = await Auth.countDocuments();

  const authAbsent = await Auth.countDocuments({
    googleSubject: { $exists: false },
  });
  const authNull = await Auth.countDocuments({
    googleSubject: { $exists: true, $type: "null" },
  });
  const authBlank = await Auth.countDocuments({
    googleSubject: { $type: "string", $regex: /^\s*$/ },
  });
  const authPopulated = await Auth.countDocuments({
    googleSubject: { $type: "string", $regex: /\S/ },
  });
  const authNonString = await Auth.countDocuments({
    $and: [
      { googleSubject: { $exists: true } },
      { googleSubject: { $not: { $type: "null" } } },
      { googleSubject: { $not: { $type: "string" } } },
    ],
  });

  // Duplicate populated googleSubject groups
  const duplicateSubjects = await Auth.aggregate([
    { $match: { googleSubject: { $type: "string", $regex: /\S/ } } },
    { $group: { _id: "$googleSubject", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();

  const authIndexes = await inspectIndexes(Auth);

  report.auth = {
    totalRecords: totalAuth,
    googleSubject: {
      absent: authAbsent,
      null: authNull,
      blankString: authBlank,
      populated: authPopulated,
      nonStringTypes: authNonString,
      duplicateSubjectGroups: duplicateSubjects.length,
      recordsInDuplicateSubjectGroups: duplicateSubjects.reduce(
        (sum, g) => sum + g.count,
        0,
      ),
    },
    indexes: authIndexes,
  };

  // ==========================================
  // 2. USERS (PROFILES) COLLECTION AUDIT
  // ==========================================
  const Users = db.collection("users");
  const totalUsers = await Users.countDocuments();

  const rollMissing = await Users.countDocuments({
    roll_no: { $exists: false },
  });
  const rollNull = await Users.countDocuments({
    roll_no: { $exists: true, $type: "null" },
  });
  const rollBlank = await Users.countDocuments({
    roll_no: { $type: "string", $regex: /^\s*$/ },
  });
  const rollNonString = await Users.countDocuments({
    $and: [
      { roll_no: { $exists: true } },
      { roll_no: { $not: { $type: "null" } } },
      { roll_no: { $not: { $type: "string" } } },
    ],
  });
  const rollPopulated = await Users.countDocuments({
    roll_no: { $type: "string", $regex: /\S/ },
  });

  // Exact duplicate groups (strings with identical characters, preserving leading zeros)
  const exactDuplicateRolls = await Users.aggregate([
    { $match: { roll_no: { $type: "string", $regex: /\S/ } } },
    { $group: { _id: "$roll_no", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();

  // Whitespace collision groups: values whose trimmed representation collides with another distinct string
  const whitespaceCollisions = await Users.aggregate([
    { $match: { roll_no: { $type: "string", $regex: /\S/ } } },
    {
      $group: {
        _id: { $trim: { input: "$roll_no" } },
        distinctExactValues: { $addToSet: "$roll_no" },
        totalRecords: { $sum: 1 },
      },
    },
    { $match: { $expr: { $gt: [{ $size: "$distinctExactValues" }, 1] } } },
  ]).toArray();

  // Verification flags vs OTP timestamp
  const flagTrueOtpAbsent = await Users.countDocuments({
    $or: [{ one_step_verified: true }, { two_step_verified: true }],
    $and: [
      {
        $or: [
          { emailOtpVerifiedAt: { $exists: false } },
          { emailOtpVerifiedAt: null },
        ],
      },
    ],
  });

  const flagTrueOtpPresent = await Users.countDocuments({
    $or: [{ one_step_verified: true }, { two_step_verified: true }],
    emailOtpVerifiedAt: { $exists: true, $ne: null },
  });

  const flagFalseOrUnset = await Users.countDocuments({
    one_step_verified: { $ne: true },
    two_step_verified: { $ne: true },
  });

  const indexedEnrollmentTrue = await Users.countDocuments({
    indexedEnrollment: true,
  });

  const userIndexes = await inspectIndexes(Users);

  report.users = {
    totalRecords: totalUsers,
    roll_no: {
      populatedStrings: rollPopulated,
      missing: rollMissing,
      null: rollNull,
      blankString: rollBlank,
      nonStringTypes: rollNonString,
      exactDuplicateGroups: exactDuplicateRolls.length,
      recordsInExactDuplicateGroups: exactDuplicateRolls.reduce(
        (sum, g) => sum + g.count,
        0,
      ),
      whitespaceCollisionGroups: whitespaceCollisions.length,
      recordsInWhitespaceCollisions: whitespaceCollisions.reduce(
        (sum, g) => sum + g.totalRecords,
        0,
      ),
    },
    verificationState: {
      flagTrueEmailOtpTimestampAbsent: flagTrueOtpAbsent,
      flagTrueEmailOtpTimestampPresent: flagTrueOtpPresent,
      flagsFalseOrUnset: flagFalseOrUnset,
    },
    indexedEnrollmentFlagTrue: indexedEnrollmentTrue,
    indexes: userIndexes,
  };

  // ==========================================
  // 3. ALUMNI ROSTER AUDIT
  // ==========================================
  const Alumni = db.collection("alumniData");
  const totalAlumni = await Alumni.countDocuments();
  const alumniIndexes = await inspectIndexes(Alumni);

  report.alumni = {
    totalRecords: totalAlumni,
    indexes: alumniIndexes,
  };

  return report;
}

function printReport(report) {
  console.log("=================================================");
  console.log("       YEARBOOK DATABASE AUDIT (AGGREGATE ONLY)");
  console.log("=================================================\n");

  console.log("--- 1. Auth Collection (Account Identity) ---");
  console.log(`Total Auth records:                       ${report.auth.totalRecords}`);
  console.log(`  googleSubject populated:                ${report.auth.googleSubject.populated}`);
  console.log(`  googleSubject absent:                   ${report.auth.googleSubject.absent}`);
  console.log(`  googleSubject explicitly null:          ${report.auth.googleSubject.null}`);
  console.log(`  googleSubject blank string:             ${report.auth.googleSubject.blankString}`);
  console.log(`  googleSubject non-string types:         ${report.auth.googleSubject.nonStringTypes}`);
  console.log(`  Duplicate googleSubject groups:         ${report.auth.googleSubject.duplicateSubjectGroups}`);
  console.log(`  Records in duplicate subject groups:    ${report.auth.googleSubject.recordsInDuplicateSubjectGroups}`);
  console.log("Indexes on Auth collection:");
  report.auth.indexes.forEach((idx) => {
    console.log(`  - ${idx.name}: key=${JSON.stringify(idx.key)} unique=${idx.unique} sparse=${idx.sparse} partial=${JSON.stringify(idx.partialFilterExpression)}`);
  });

  console.log("\n--- 2. Users Collection (Profile Records) ---");
  console.log(`Total User profile records:               ${report.users.totalRecords}`);
  console.log(`  roll_no populated strings:              ${report.users.roll_no.populatedStrings}`);
  console.log(`  roll_no missing:                        ${report.users.roll_no.missing}`);
  console.log(`  roll_no explicitly null:                ${report.users.roll_no.null}`);
  console.log(`  roll_no blank string:                   ${report.users.roll_no.blankString}`);
  console.log(`  roll_no non-string types:               ${report.users.roll_no.nonStringTypes}`);
  console.log(`  Exact duplicate roll_no groups:         ${report.users.roll_no.exactDuplicateGroups}`);
  console.log(`  Records in exact duplicate groups:      ${report.users.roll_no.recordsInExactDuplicateGroups}`);
  console.log(`  Whitespace collision groups:            ${report.users.roll_no.whitespaceCollisionGroups}`);
  console.log(`  Records in whitespace collision groups: ${report.users.roll_no.recordsInWhitespaceCollisions}`);
  console.log("Verification flags vs emailOtpVerifiedAt timestamp:");
  console.log(`  Verification flag true & OTP timestamp absent:  ${report.users.verificationState.flagTrueEmailOtpTimestampAbsent}`);
  console.log(`  Verification flag true & OTP timestamp present: ${report.users.verificationState.flagTrueEmailOtpTimestampPresent}`);
  console.log(`  Verification flags false or unset:              ${report.users.verificationState.flagsFalseOrUnset}`);
  console.log(`Profiles with indexedEnrollment=true:     ${report.users.indexedEnrollmentFlagTrue}`);
  console.log("Indexes on Users collection:");
  report.users.indexes.forEach((idx) => {
    console.log(`  - ${idx.name}: key=${JSON.stringify(idx.key)} unique=${idx.unique} sparse=${idx.sparse} partial=${JSON.stringify(idx.partialFilterExpression)}`);
  });

  console.log("\n--- 3. Alumni Roster Collection ---");
  console.log(`Total Alumni roster records:              ${report.alumni.totalRecords}`);
  console.log("Indexes on Alumni collection:");
  report.alumni.indexes.forEach((idx) => {
    console.log(`  - ${idx.name}: key=${JSON.stringify(idx.key)} unique=${idx.unique} sparse=${idx.sparse} partial=${JSON.stringify(idx.partialFilterExpression)}`);
  });

  console.log("\n=================================================");
  console.log("         END OF AUDIT (ZERO MUTATIONS)");
  console.log("=================================================");
}

async function main() {
  const uri = process.env.MONGODB_LINK;
  if (!uri) {
    console.error("❌ AUDIT INCOMPLETE: MONGODB_LINK is not set in environment.");
    process.exit(1);
  }

  let connection = null;
  let success = false;

  try {
    connection = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
    }).asPromise();

    const report = await runAudit(connection.db);
    printReport(report);
    success = true;
  } catch (err) {
    console.error("\n❌ AUDIT INCOMPLETE: A database error occurred during execution.");
    console.error("Failure reason:", err.message);
    success = false;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (_) {}
    }
  }

  if (!success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runAudit, inspectIndexes, printReport };
