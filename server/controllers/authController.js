const Auth = require("../models/authModel");
const Alumni = require("../models/alumniData");
const identity = require("../middlewares/identity");
const { googleIdentity } = require("../utils/token.util");
const wrap = require("express-async-handler");

exports.login = wrap(async (req, res) => {
  let claims;
  try {
    claims = await googleIdentity(req.body.credential);
  } catch (err) {
    return res
      .status(err.status || 401)
      .json({ message: "Google sign-in could not be verified" });
  }
  if (claims.email_verified !== true || typeof claims.email !== "string")
    return res.sendStatus(403);
  const email = claims.email.toLowerCase();
  const alumni = Boolean(await Alumni.exists({ email }));
  if (!alumni && claims.hd !== "iiti.ac.in")
    return res
      .status(403)
      .json({ message: "An institute account is required" });
  // Only Google-managed addresses can safely claim a legacy email-only account automatically.
  const authoritative = Boolean(claims.hd) || email.endsWith("@gmail.com");
  const conditions = [{ googleSubject: claims.sub }];
  if (authoritative) conditions.push({ googleSubject: { $exists: false } });
  let account;
  try {
    account = await Auth.findOneAndUpdate(
      { email, $or: conditions },
      { $set: { googleSubject: claims.sub, name: claims.name || email } },
      { new: true, upsert: authoritative, runValidators: true },
    );
  } catch (err) {
    if (err.code !== 11000) throw err;
  }
  if (!account)
    return res
      .status(403)
      .json({ message: "Account linking requires administrator review" });
  await identity.login(req, res, account._id, alumni, claims.picture);
  res.sendStatus(204);
});
exports.session = (req, res) => {
  const p = req.profile;
  res.json({
    user: req.user,
    profile: p && {
      _id: p._id,
      email: p.email,
      name: p.name,
      roll_no: p.roll_no,
      profile_img: p.profile_img?.url,
      department: p.department,
      about: p.about,
      academic_program: p.academic_program,
      pendingPhone: p.one_step_verified ? undefined : p.contact_details,
      pendingEmail: p.two_step_verified ? undefined : p.personal_email_id,
      one_step_verified: p.one_step_verified,
      two_step_verified: p.two_step_verified,
    },
  });
};
exports.logout = wrap(async (req, res) => {
  await identity.logout(req, res);
  res.sendStatus(204);
});
