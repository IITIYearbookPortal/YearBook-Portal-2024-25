const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const crypto = require("node:crypto");
const otp = require("../utils/otp");

const DISPOSABLE_URI = "mongodb://127.0.0.1:27017/yearbook_disposable_test";

let connection;
let db;

before(async () => {
  try {
    connection = await mongoose.createConnection(DISPOSABLE_URI, {
      serverSelectionTimeoutMS: 3000,
    }).asPromise();
    db = connection.db;
    await db.dropDatabase();
  } catch (err) {
    console.warn("Local disposable MongoDB not available:", err.message);
  }
});

after(async () => {
  if (connection) {
    try {
      await db.dropDatabase();
      await connection.close();
    } catch (_) {}
  }
});

test("disposable MongoDB: simultaneous votes by same member atomically increment once", async (t) => {
  if (!connection) return t.skip("Local disposable MongoDB unavailable");

  const Polls = db.collection("polls");
  const pollId = new mongoose.Types.ObjectId();
  const voterId = new mongoose.Types.ObjectId();

  await Polls.insertOne({
    _id: pollId,
    question: "Best Campus Spot?",
    options: [
      { option: "Central Library", voteCount: 0 },
      { option: "Cafeteria", voteCount: 0 },
    ],
    votes: [],
    academic_program: "Bachelor of Technology (BTech)",
  });

  // Fire 10 simultaneous concurrent votes by the exact same voter
  const results = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const update = await Polls.updateOne(
        {
          _id: pollId,
          "options.option": "Central Library",
          "votes.votedBy": { $ne: voterId },
        },
        {
          $inc: { "options.$.voteCount": 1 },
          $push: { votes: { option: "Central Library", votedBy: voterId } },
        },
      );
      return update.modifiedCount;
    }),
  );

  const successfulVotes = results.filter((c) => c === 1).length;
  const rejectedVotes = results.filter((c) => c === 0).length;

  assert.equal(successfulVotes, 1, "Exactly one concurrent vote must be recorded");
  assert.equal(rejectedVotes, 9, "All 9 concurrent duplicate votes must be rejected");

  // Verify in-database consistency
  const pollInDb = await Polls.findOne({ _id: pollId });
  assert.equal(pollInDb.options[0].voteCount, 1, "voteCount must be exactly 1");
  assert.equal(pollInDb.votes.length, 1, "votes array must contain exactly one record");
  assert.equal(pollInDb.votes[0].votedBy.toString(), voterId.toString());
});

test("disposable MongoDB: competing first-time Google links cannot overwrite each other", async (t) => {
  if (!connection) return t.skip("Local disposable MongoDB unavailable");

  const Auths = db.collection("auths");
  const accountId = new mongoose.Types.ObjectId();
  const email = "member_race@iiti.ac.in";

  await Auths.insertOne({
    _id: accountId,
    email,
    name: "Member Race",
  });

  const linkAttempt = async (sub) => {
    return Auths.findOneAndUpdate(
      {
        email,
        $or: [{ googleSubject: sub }, { googleSubject: { $exists: false } }],
      },
      { $set: { googleSubject: sub } },
      { returnDocument: "after" },
    );
  };

  // Two competing Google accounts attempt to link to the same unlinked legacy email simultaneously
  const [res1, res2] = await Promise.all([
    linkAttempt("sub-alpha"),
    linkAttempt("sub-beta"),
  ]);

  const winner = [res1, res2].filter(Boolean);
  assert.ok(winner.length >= 1);

  const finalDoc = await Auths.findOne({ email });
  assert.equal(finalDoc._id.toString(), accountId.toString(), "Original _id must survive linking");
  assert.ok(["sub-alpha", "sub-beta"].includes(finalDoc.googleSubject));

  // A third attempt with a different sub must fail
  const thirdAttempt = await linkAttempt("sub-gamma");
  assert.equal(thirdAttempt, null, "Conflicting subject cannot claim already-linked account");
});

test("disposable MongoDB: one-time OTP consumption is strictly single-use under concurrency", async (t) => {
  if (!connection) return t.skip("Local disposable MongoDB unavailable");

  process.env.OTP_SECRET = "fixture-secret-at-least-32-bytes-long-for-test";
  const Users = db.collection("users");
  const userId = new mongoose.Types.ObjectId();
  const nonce = "nonce123";
  const code = "654321";
  const validHash = otp.hash(nonce, code);

  await Users.insertOne({
    _id: userId,
    email: "alumnus@iiti.ac.in",
    one_step_verified: true,
    two_step_verified: false,
    otp: {
      nonce,
      hash: validHash,
      purpose: "signup-email",
      destination: "personal@example.invalid",
      expires: new Date(Date.now() + 60000),
      remaining: 5,
    },
  });

  // 10 concurrent requests attempt to consume the same valid OTP code simultaneously
  const results = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const applied = await Users.updateOne(
        {
          _id: userId,
          "otp.nonce": nonce,
          "otp.hash": validHash,
          "otp.expires": { $gt: new Date() },
        },
        {
          $unset: { otp: 1 },
          $set: {
            personal_email_id: "personal@example.invalid",
            two_step_verified: true,
            emailOtpVerifiedAt: new Date(),
          },
        },
      );
      return applied.modifiedCount;
    }),
  );

  const consumedCount = results.filter((c) => c === 1).length;
  const rejectedCount = results.filter((c) => c === 0).length;

  assert.equal(consumedCount, 1, "OTP must be consumed exactly once");
  assert.equal(rejectedCount, 9, "All 9 concurrent requests must fail consumption");

  const userInDb = await Users.findOne({ _id: userId });
  assert.equal(userInDb.two_step_verified, true);
  assert.equal(userInDb.otp, undefined, "OTP field must be removed after single consumption");
  assert.ok(userInDb.emailOtpVerifiedAt instanceof Date);
});

test("disposable MongoDB: concurrent memory decisions resolve atomically", async (t) => {
  if (!connection) return t.skip("Local disposable MongoDB unavailable");

  const Memories = db.collection("memories");
  const Pending = db.collection("pendingmemories");
  const groupId = crypto.randomUUID();

  await Memories.insertMany([
    {
      groupId,
      seniorId: "senior1@iiti.ac.in",
      authorName: "Author",
      authorEmail: "author@iiti.ac.in",
      content: "Great times",
      toBeAcceptedBy: ["senior1@iiti.ac.in", "senior2@iiti.ac.in"],
    },
    {
      groupId,
      seniorId: "senior2@iiti.ac.in",
      authorName: "Author",
      authorEmail: "author@iiti.ac.in",
      content: "Great times",
      toBeAcceptedBy: ["senior1@iiti.ac.in", "senior2@iiti.ac.in"],
    },
  ]);

  await Pending.insertOne({
    seniorEmail: "senior1@iiti.ac.in",
    memoryGroupIds: [groupId],
  });
  await Pending.insertOne({
    seniorEmail: "senior2@iiti.ac.in",
    memoryGroupIds: [groupId],
  });

  // Simultaneous approvals by both seniors
  const [app1, app2] = await Promise.all([
    Memories.updateMany(
      { groupId, toBeAcceptedBy: "senior1@iiti.ac.in" },
      { $pull: { toBeAcceptedBy: "senior1@iiti.ac.in" } },
    ),
    Memories.updateMany(
      { groupId, toBeAcceptedBy: "senior2@iiti.ac.in" },
      { $pull: { toBeAcceptedBy: "senior2@iiti.ac.in" } },
    ),
  ]);

  assert.equal(app1.modifiedCount, 2);
  assert.equal(app2.modifiedCount, 2);

  const docs = await Memories.find({ groupId }).toArray();
  for (const doc of docs) {
    assert.deepEqual(doc.toBeAcceptedBy, [], "Memory group must have all approvals cleared");
  }
});

test("disposable MongoDB: unique roll-number index enforces uniqueness and preserves leading zeros", async (t) => {
  if (!connection) return t.skip("Local disposable MongoDB unavailable");

  const Users = db.collection("users_index_test");
  await Users.drop().catch(() => {});

  // Create full unique index on roll_no
  await Users.createIndex({ roll_no: 1 }, { unique: true });

  // 1. Insert valid string roll with leading zeros: "001" and "01"
  await Users.insertOne({ roll_no: "001", name: "Student 001" });
  await Users.insertOne({ roll_no: "01", name: "Student 01" });

  const count001 = await Users.countDocuments({ roll_no: "001" });
  const count01 = await Users.countDocuments({ roll_no: "01" });
  assert.equal(count001, 1);
  assert.equal(count01, 1);

  // 2. Inserting duplicate "001" must throw E11000 duplicate key error
  await assert.rejects(
    Users.insertOne({ roll_no: "001", name: "Duplicate" }),
    (err) => err.code === 11000,
    "MongoDB must enforce unique roll_no index and reject duplicate insertion",
  );
});
