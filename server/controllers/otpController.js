const crypto = require("node:crypto");
const mongoose = require("mongoose");
const wrap = require("express-async-handler");
const Users = require("../models/userModel");
const otp = require("../utils/otp");
const enrollment = require("../utils/enrollment");

const Budgets = mongoose.model(
  "OtpBudget",
  new mongoose.Schema({
    _id: String,
    count: Number,
    expires: { type: Date, expires: 0 },
  }),
);

async function checkBudget(key, now) {
  const hour = Math.floor(now / 3600000);
  const budget = await Budgets.findByIdAndUpdate(
    key + ":" + hour,
    {
      $inc: { count: 1 },
      $setOnInsert: { expires: new Date((hour + 2) * 3600000) },
    },
    { upsert: true, new: true },
  );
  if (budget.count > 10)
    throw otp.fail(429, "Hourly verification limit reached.");
}

function destinationFor(purpose, profile, requested) {
  if (!profile) throw otp.fail(403, "Save your signup details first");
  if (purpose === "signup-phone" && !profile.one_step_verified) {
    const value = requested || profile.contact_details;
    if (!otp.validPhone(value))
      throw otp.fail(400, "Use an international phone number including +");
    return value;
  }
  if (
    purpose === "signup-email" &&
    profile.one_step_verified &&
    !profile.two_step_verified
  ) {
    const value = requested || profile.personal_email_id;
    if (!otp.validEmail(value))
      throw otp.fail(400, "Enter a valid email address");
    return value;
  }
  if (
    purpose === "edit-profile" &&
    profile.one_step_verified &&
    profile.two_step_verified
  )
    return profile.emailOtpVerifiedAt
      ? profile.personal_email_id
      : profile.email;
  throw otp.fail(403, "Verification is unavailable for this action");
}

exports.getWidget = (req, res) => {
  if (!req.profile || req.profile.one_step_verified)
    throw otp.fail(403, "Phone verification is unavailable for this profile");
  const widget = otp.widgetConfig();
  if (!widget) return res.sendStatus(204);
  if (!process.env.MSG91_AUTH_KEY)
    throw otp.fail(503, "MSG91 phone verification is not configured");
  res.json(widget);
};

exports.send = wrap(async (req, res) => {
  const { purpose, destination: requested } = req.body;
  const destination = destinationFor(purpose, req.profile, requested);
  const now = Date.now();
  const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
  const nonce = crypto.randomBytes(16).toString("hex");
  const challenge = {
    purpose,
    destination,
    session: req.sessionHash,
    nonce,
    hash: otp.hash(nonce, code),
    remaining: 5,
    issued: new Date(now),
    expires: new Date(now + otp.lifetime),
  };
  const claimed = await Users.updateOne(
    {
      _id: req.profile._id,
      $or: [
        { "otp.issued": { $exists: false } },
        { "otp.issued": { $lte: new Date(now - 60000) } },
      ],
    },
    { $set: { otp: challenge } },
  );
  if (!claimed.modifiedCount)
    return res
      .status(429)
      .json({ message: "Wait one minute before requesting another code." });
  await checkBudget(req.profile._id, now);
  try {
    await otp.deliver(purpose, destination, code);
  } catch {
    await Users.updateOne(
      { _id: req.profile._id, "otp.nonce": nonce },
      { $unset: { "otp.hash": 1 } },
    );
    return res
      .status(503)
      .json({
        message:
          "Code delivery failed. Check the destination and try again in a minute.",
      });
  }
  res.json({ message: "Verification code sent.", destination });
});

async function consume(req, purpose, code) {
  if (!req.profile || typeof code !== "string" || !/^\d{6}$/.test(code))
    throw otp.fail(400, "Enter the six-digit code");
  const match = {
    _id: req.profile._id,
    "otp.purpose": purpose,
    "otp.session": req.sessionHash,
    "otp.expires": { $gt: new Date() },
    "otp.remaining": { $gt: 0 },
    "otp.hash": { $exists: true },
  };
  const doc = await Users.findOneAndUpdate(
    match,
    { $inc: { "otp.remaining": -1 } },
    { new: false },
  )
    .select("+otp")
    .lean();
  const savedHash = doc?.otp?.hash;
  if (!savedHash || !/^[a-f0-9]{64}$/.test(savedHash) ||
      !crypto.timingSafeEqual(
        Buffer.from(otp.hash(doc.otp.nonce, code), "hex"),
        Buffer.from(savedHash, "hex"),
      ))
    throw otp.fail(403, "Invalid or expired code");
  const changes = { $unset: { otp: 1 } };
  if (purpose === "signup-phone")
    changes.$set = {
      contact_details: doc.otp.destination,
      one_step_verified: true,
    };
  if (purpose === "signup-email")
    changes.$set = {
      personal_email_id: doc.otp.destination,
      two_step_verified: true,
      emailOtpVerifiedAt: new Date(),
    };
  const applied = await Users.updateOne(
    {
      _id: doc._id,
      "otp.nonce": doc.otp.nonce,
      "otp.hash": doc.otp.hash,
      "otp.expires": { $gt: new Date() },
    },
    changes,
  );
  if (!applied.modifiedCount)
    throw otp.fail(403, "Code already used or superseded");
}
exports.verifySignup = wrap(async (req, res) => {
  const { purpose, code, widgetToken } = req.body;
  if (!["signup-phone", "signup-email"].includes(purpose))
    return res.sendStatus(400);
  const destination = destinationFor(purpose, req.profile, req.body.destination);
  await enrollment.requireEnrollment(req.user.email, req.profile.roll_no);
  if (purpose === "signup-phone" && widgetToken !== undefined) {
    await checkBudget("widget:" + req.profile._id, Date.now());
    await otp.verifyWidgetPhone(widgetToken, destination);
    const applied = await Users.updateOne(
      {
        _id: req.profile._id,
        one_step_verified: { $ne: true },
        contact_details: req.profile.contact_details,
      },
      {
        $set: { contact_details: destination, one_step_verified: true },
        $unset: { otp: 1 },
      },
    );
    if (!applied.modifiedCount)
      throw otp.fail(409, "Phone verification was already completed or the profile changed");
  } else {
    await consume(req, purpose, code);
  }
  res.sendStatus(204);
});
exports.verifyEdit = wrap(async (req, res, next) => {
  await consume(req, "edit-profile", req.get("X-Yearbook-OTP"));
  next();
});
