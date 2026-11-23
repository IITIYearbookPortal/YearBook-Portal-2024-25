const Alumni = require("../models/alumniData");
const { fail } = require("./otp");

function enrollmentFromEmail(email) {
  return /^[a-z]+(\d{9,10})@iiti\.ac\.in$/.exec(email)?.[1];
}

async function requireEnrollment(email, rollNumber) {
  if (typeof rollNumber !== "string" || !/^\d{1,10}$/.test(rollNumber))
    throw fail(400, "Enter a valid enrollment number");

  const record = await Alumni.findOne({ email }).select("roll_no").lean();
  const expected = record && (
    record.roll_no || enrollmentFromEmail(email)
  );
  if (!expected)
    throw fail(403, "Ask the Alumni Cell to confirm your enrollment number");
  if (rollNumber !== expected)
    throw fail(403, "The enrollment number does not match your institute account");
}

module.exports = { enrollmentFromEmail, requireEnrollment };
