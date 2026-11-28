const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const { runAudit } = require("../scripts/audit-database");

/**
 * Creates a synthetic in-memory collection supporting the exact queries
 * executed by audit-database.js.
 */
function createSyntheticCollection(docs = [], indexes = []) {
  return {
    async countDocuments(filter = {}) {
      return docs.filter((doc) => matchDoc(doc, filter)).length;
    },
    aggregate(pipeline = []) {
      return {
        async toArray() {
          let current = [...docs];
          for (const stage of pipeline) {
            if (stage.$match) {
              current = current.filter((doc) => matchDoc(doc, stage.$match));
            }
            if (stage.$group) {
              current = groupDocs(current, stage.$group);
            }
            if (stage.$sort) {
              // sorting handled as needed
            }
          }
          return current;
        },
      };
    },
    listIndexes() {
      return {
        async toArray() {
          return indexes;
        },
      };
    },
  };
}

function matchDoc(doc, filter) {
  for (const [key, val] of Object.entries(filter)) {
    if (key === "$or") {
      if (!val.some((subFilter) => matchDoc(doc, subFilter))) return false;
      continue;
    }
    if (key === "$and") {
      if (!val.every((subFilter) => matchDoc(doc, subFilter))) return false;
      continue;
    }
    if (key === "$expr") {
      if (val.$gt) {
        const [left, right] = val.$gt;
        if (left.$size) {
          const arr = doc[left.$size.replace("$", "")];
          if (!Array.isArray(arr) || arr.length <= right) return false;
        }
      }
      continue;
    }

    const fieldVal = doc[key];

    if (val && typeof val === "object" && !(val instanceof RegExp)) {
      if ("$gt" in val) {
        if (typeof fieldVal !== "number" || fieldVal <= val.$gt) return false;
      }
      if ("$gte" in val) {
        if (typeof fieldVal !== "number" || fieldVal < val.$gte) return false;
      }
      if ("$lt" in val) {
        if (typeof fieldVal !== "number" || fieldVal >= val.$lt) return false;
      }
      if ("$lte" in val) {
        if (typeof fieldVal !== "number" || fieldVal > val.$lte) return false;
      }
      if ("$exists" in val) {
        const exists = key in doc && doc[key] !== undefined;
        if (val.$exists !== exists) return false;
      }
      if ("$type" in val) {
        if (val.$type === "null" && fieldVal !== null) return false;
        if (val.$type === "string" && typeof fieldVal !== "string") return false;
      }
      if ("$not" in val) {
        if (matchDoc({ [key]: fieldVal }, { [key]: val.$not })) return false;
      }
      if ("$regex" in val) {
        if (typeof fieldVal !== "string" || !val.$regex.test(fieldVal)) return false;
      }
      if ("$ne" in val) {
        if (fieldVal === val.$ne) return false;
      }
    } else if (val instanceof RegExp) {
      if (typeof fieldVal !== "string" || !val.test(fieldVal)) return false;
    } else {
      if (fieldVal !== val) return false;
    }
  }
  return true;
}

function groupDocs(docs, groupSpec) {
  const groups = new Map();

  for (const doc of docs) {
    let groupKey;
    if (typeof groupSpec._id === "string" && groupSpec._id.startsWith("$")) {
      const field = groupSpec._id.slice(1);
      groupKey = doc[field];
    } else if (groupSpec._id && groupSpec._id.$trim) {
      const field = groupSpec._id.$trim.input.slice(1);
      groupKey = typeof doc[field] === "string" ? doc[field].trim() : String(doc[field]);
    } else {
      groupKey = "all";
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        _id: groupKey,
        count: 0,
        totalRecords: 0,
        distinctExactValues: new Set(),
      });
    }

    const entry = groups.get(groupKey);
    entry.count += 1;
    entry.totalRecords += 1;

    if (groupSpec.distinctExactValues && groupSpec.distinctExactValues.$addToSet) {
      const field = groupSpec.distinctExactValues.$addToSet.slice(1);
      entry.distinctExactValues.add(doc[field]);
    }
  }

  return Array.from(groups.values()).map((g) => ({
    _id: g._id,
    count: g.count,
    totalRecords: g.totalRecords,
    distinctExactValues: Array.from(g.distinctExactValues),
  }));
}

function createSyntheticDb({ auths = [], users = [], alumni = [], userIndexes = [], authIndexes = [] }) {
  return {
    collection(name) {
      if (name === "auths") return createSyntheticCollection(auths, authIndexes);
      if (name === "users") return createSyntheticCollection(users, userIndexes);
      if (name === "alumniData") return createSyntheticCollection(alumni, []);
      throw new Error("Unknown synthetic collection: " + name);
    },
  };
}

test("synthetic audit fixture: clean data with valid indexes and leading zeros", async () => {
  const db = createSyntheticDb({
    auths: [
      { email: "user1@example.invalid", googleSubject: "sub-1" },
      { email: "user2@example.invalid", googleSubject: "sub-2" },
      { email: "user3@example.invalid", googleSubject: "sub-3" },
    ],
    users: [
      { roll_no: "001", one_step_verified: true, two_step_verified: true, emailOtpVerifiedAt: new Date(), indexedEnrollment: true },
      { roll_no: "002", one_step_verified: true, two_step_verified: true, emailOtpVerifiedAt: new Date(), indexedEnrollment: true },
      { roll_no: "003", one_step_verified: true, two_step_verified: true, emailOtpVerifiedAt: new Date(), indexedEnrollment: true },
    ],
    userIndexes: [
      { name: "_id_", key: { _id: 1 } },
      { name: "roll_no_1", key: { roll_no: 1 }, unique: true, partialFilterExpression: { indexedEnrollment: true } },
    ],
  });

  const report = await runAudit(db);

  assert.equal(report.auth.totalRecords, 3);
  assert.equal(report.auth.googleSubject.populated, 3);
  assert.equal(report.auth.googleSubject.absent, 0);
  assert.equal(report.auth.googleSubject.null, 0);
  assert.equal(report.auth.googleSubject.blankString, 0);
  assert.equal(report.auth.googleSubject.duplicateSubjectGroups, 0);

  assert.equal(report.users.totalRecords, 3);
  assert.equal(report.users.roll_no.populatedStrings, 3);
  assert.equal(report.users.roll_no.missing, 0);
  assert.equal(report.users.roll_no.exactDuplicateGroups, 0);
  assert.equal(report.users.roll_no.whitespaceCollisionGroups, 0);
  assert.equal(report.users.verificationState.flagTrueEmailOtpTimestampAbsent, 0);
  assert.equal(report.users.verificationState.flagTrueEmailOtpTimestampPresent, 3);
  assert.equal(report.users.indexedEnrollmentFlagTrue, 3);

  // Index inspection verification
  assert.equal(report.users.indexes.length, 2);
  const rollIndex = report.users.indexes.find((i) => i.name === "roll_no_1");
  assert.ok(rollIndex);
  assert.equal(rollIndex.unique, true);
  assert.deepEqual(rollIndex.partialFilterExpression, { indexedEnrollment: true });
});

test("synthetic audit fixture: detects exact duplicate rolls and whitespace collisions separately", async () => {
  const db = createSyntheticDb({
    users: [
      // Exact duplicate group with leading zero preserved: "007"
      { roll_no: "007" },
      { roll_no: "007" },
      // Whitespace collision: "008" vs " 008 "
      { roll_no: "008" },
      { roll_no: " 008 " },
      // Unique clean
      { roll_no: "009" },
    ],
  });

  const report = await runAudit(db);

  assert.equal(report.users.totalRecords, 5);
  assert.equal(report.users.roll_no.populatedStrings, 5);
  // Exact duplicate: "007" appearing twice
  assert.equal(report.users.roll_no.exactDuplicateGroups, 1);
  assert.equal(report.users.roll_no.recordsInExactDuplicateGroups, 2);

  // Whitespace collision: "008" colliding with " 008 "
  assert.equal(report.users.roll_no.whitespaceCollisionGroups, 1);
  assert.equal(report.users.roll_no.recordsInWhitespaceCollisions, 2);
});

test("synthetic audit fixture: categorizes malformed values and verification discrepancies", async () => {
  const db = createSyntheticDb({
    auths: [
      { email: "user1@example.invalid" }, // absent googleSubject
      { email: "user2@example.invalid", googleSubject: null }, // explicitly null
      { email: "user3@example.invalid", googleSubject: "   " }, // blank
      { email: "user4@example.invalid", googleSubject: 12345 }, // non-string
      { email: "user5@example.invalid", googleSubject: "goog-dup" }, // duplicate subject 1
      { email: "user6@example.invalid", googleSubject: "goog-dup" }, // duplicate subject 2
    ],
    users: [
      { email: "u1@example.invalid" }, // missing roll_no
      { email: "u2@example.invalid", roll_no: null }, // explicitly null roll_no
      { email: "u3@example.invalid", roll_no: "  \t " }, // blank roll_no
      { email: "u4@example.invalid", roll_no: 99999 }, // non-string roll_no
      // Verification flag true but OTP timestamp absent
      { roll_no: "101", one_step_verified: true },
      { roll_no: "102", two_step_verified: true, emailOtpVerifiedAt: null },
      // Completely unverified
      { roll_no: "103", one_step_verified: false, two_step_verified: false },
    ],
  });

  const report = await runAudit(db);

  // Auth assertions
  assert.equal(report.auth.googleSubject.absent, 1);
  assert.equal(report.auth.googleSubject.null, 1);
  assert.equal(report.auth.googleSubject.blankString, 1);
  assert.equal(report.auth.googleSubject.nonStringTypes, 1);
  assert.equal(report.auth.googleSubject.populated, 2);
  assert.equal(report.auth.googleSubject.duplicateSubjectGroups, 1);
  assert.equal(report.auth.googleSubject.recordsInDuplicateSubjectGroups, 2);

  // User roll assertions
  assert.equal(report.users.roll_no.missing, 1);
  assert.equal(report.users.roll_no.null, 1);
  assert.equal(report.users.roll_no.blankString, 1);
  assert.equal(report.users.roll_no.nonStringTypes, 1);
  assert.equal(report.users.roll_no.populatedStrings, 3); // "101", "102", "103"

  // Verification state assertions
  assert.equal(report.users.verificationState.flagTrueEmailOtpTimestampAbsent, 2);
  assert.equal(report.users.verificationState.flagTrueEmailOtpTimestampPresent, 0);
  assert.equal(report.users.verificationState.flagsFalseOrUnset, 5); // u1, u2, u3, u4, and 103
});

test("CLI audit execution: unavailable database exits nonzero and reports incomplete", async () => {
  const scriptPath = path.resolve(__dirname, "../scripts/audit-database.js");

  const child = spawn(process.execPath, [scriptPath], {
    env: { ...process.env, MONGODB_LINK: "mongodb://127.0.0.1:27999/unavailable_db" },
  });

  let output = "";
  child.stdout.on("data", (d) => { output += d.toString(); });
  child.stderr.on("data", (d) => { output += d.toString(); });

  const exitCode = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  assert.equal(exitCode, 1, "Script must exit nonzero when database is unreachable");
  assert.match(output, /AUDIT INCOMPLETE/, "Output must explicitly indicate incomplete audit");
});
