const path = require("node:path");
const { readFile } = require("node:fs/promises");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Alumni = require("./models/alumniData");
const { validEmail } = require("./utils/otp");

async function importRoster(filename) {
  if (!filename) throw new Error("Usage: node importAlumni.js <private-roster.json>");
  const rows = JSON.parse(await readFile(filename, "utf8"));
  if (!Array.isArray(rows) || !rows.length) throw new Error("Expected a nonempty roster array");
  const emails = new Set();
  const updates = rows.map((row, index) => {
    const address = typeof row === "string" ? row : row?.email;
    const email = typeof address === "string" && address.trim().toLowerCase();
    const roll = row?.roll_no;
    if (!validEmail(email) || emails.has(email) ||
        (roll !== undefined && (typeof roll !== "string" || !/^\d{1,10}$/.test(roll))))
      throw new Error("Invalid or duplicate roster entry at row " + (index + 1));
    emails.add(email);
    const update = roll ? { $set: { roll_no: roll } } : { $setOnInsert: { email } };
    return { updateOne: { filter: { email }, update, upsert: true } };
  });
  await mongoose.connect(process.env.MONGODB_LINK);
  try {
    await Alumni.bulkWrite(updates);
    console.log("Imported " + updates.length + " roster entries");
  } finally {
    await mongoose.disconnect();
  }
}

importRoster(process.argv[2]).catch((error) => {
  const validation = /^(Usage:|Invalid or duplicate roster entry|Expected a nonempty roster)/;
  console.error("Roster import failed:", validation.test(error.message) ? error.message : error.name);
  process.exitCode = 1;
});
