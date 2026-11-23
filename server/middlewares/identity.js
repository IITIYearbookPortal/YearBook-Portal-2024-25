const crypto = require("node:crypto");
const mongoose = require("mongoose");
const wrap = require("express-async-handler");
const Users = require("../models/userModel");
const Auth = require("../models/authModel");
const { enrollmentFromEmail, requireEnrollment } = require("../utils/enrollment");

const Session = mongoose.model(
  "PortalSession",
  new mongoose.Schema({
    _id: String,
    account: { type: mongoose.Schema.Types.ObjectId, required: true },
    alumni: Boolean,
    picture: String,
    expires: { type: Date, expires: 0 },
  }),
);
const lifetime = 12 * 60 * 60 * 1000;
const cookie = "yearbook_session";
const digest = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const options = () => {
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.SERVER_LINK?.startsWith("https://");
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
  };
};
async function logout(req, res) {
  if (req.cookies[cookie])
    await Session.deleteOne({ _id: digest(req.cookies[cookie]) });
  res.clearCookie(cookie, options());
}
async function login(req, res, account, alumni, picture) {
  await logout(req, res);
  const value = crypto.randomBytes(32).toString("hex");
  await Session.create({
    _id: digest(value),
    account,
    alumni,
    picture,
    expires: new Date(Date.now() + lifetime),
  });
  res.cookie(cookie, value, { ...options(), maxAge: lifetime });
}
const requireUser = wrap(async (req, res, next) => {
  res.set("Cache-Control", "no-store");
  const value = req.cookies[cookie];
  const session =
    typeof value === "string" &&
    (await Session.findOne({
      _id: digest(value),
      expires: { $gt: new Date() },
    }).lean());
  const account = session && (await Auth.findById(session.account).lean());
  if (!account) return res.status(401).json({ message: "Sign in required" });
  req.sessionHash = digest(value);
  req.profile = session.alumni
    ? await Users.findOne({ email: account.email }).lean()
    : null;
  req.user = {
    email: account.email,
    name: account.name,
    picture: session.picture,
    jti: String(account._id),
    alumni: session.alumni,
    pollAdmin: (process.env.POLL_ADMIN_EMAILS || "")
      .split(",")
      .some((email) => email.trim() === account.email),
  };
  req.actorId = session.alumni ? req.profile?._id : account._id;
  next();
});
const requireMember = wrap(async (req, res, next) => {
  if (
    req.user.alumni &&
    !(req.profile?.one_step_verified && req.profile?.two_step_verified)
  )
    return res.status(403).json({ message: "Complete account verification" });
  if (req.user.alumni) {
    const expected = enrollmentFromEmail(req.user.email);
    if (expected && req.profile.roll_no !== expected)
      await requireEnrollment(req.user.email, req.profile.roll_no);
  }
  next();
});
function requireAlumni(req, res, next) {
  if (!req.user.alumni) return res.sendStatus(403);
  next();
}
function ownRoll(req, res, next) {
  if (
    !req.profile ||
    req.profile.roll_no !== String(req.body.comment_reciever_roll_no)
  )
    return res.sendStatus(403);
  next();
}
module.exports = {
  login,
  logout,
  requireUser,
  requireMember,
  requireAlumni,
  ownRoll,
  digest,
};
