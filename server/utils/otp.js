const crypto = require("node:crypto");
const nodemailer = require("nodemailer");
const validEmail = (value) =>
  typeof value === "string" &&
  value.length <= 254 &&
  /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value);
const validPhone = (value) =>
  typeof value === "string" && /^\+[1-9]\d{6,14}$/.test(value);
const lifetime = 5 * 60000;
const fail = (status, message) => Object.assign(new Error(message), { status });

function hash(nonce, code) {
  if (!process.env.OTP_SECRET || Buffer.byteLength(process.env.OTP_SECRET) < 32)
    throw fail(503, "Verification is not configured");
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(nonce + ":" + code)
    .digest("hex");
}

let smtp;
async function deliver(purpose, destination, code) {
  if (purpose === "signup-phone") {
    const { MSG91_AUTH_KEY, MSG91_TEMPLATE_ID } = process.env;
    if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID)
      throw fail(503, "SMS verification is not configured");
    const url = new URL("https://control.msg91.com/api/v5/otp");
    url.search = new URLSearchParams({
      template_id: MSG91_TEMPLATE_ID,
      mobile: destination.slice(1),
      otp: code,
      otp_length: "6",
      otp_expiry: "5",
    });
    const response = await fetch(url, {
      method: "POST",
      headers: { authkey: MSG91_AUTH_KEY, "content-type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok || (await response.json()).type !== "success")
      throw fail(503, "SMS delivery unavailable");
    return;
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_FROM || !SMTP_USER || !SMTP_PASS)
    throw fail(503, "Email verification is not configured");
  const port = Number(SMTP_PORT || 587);
  smtp ||= nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    pool: true,
    maxConnections: 5,
    connectionTimeout: 10000,
    socketTimeout: 20000,
  });
  const action =
    purpose === "edit-profile"
      ? "save your yearbook profile changes"
      : "verify your yearbook email";
  await smtp.sendMail({
    from: SMTP_FROM,
    to: destination,
    subject: "Yearbook verification code",
    text:
      "Your code to " +
      action +
      " is " +
      code +
      ". It expires in five minutes. Do not share this code.",
  });
}
module.exports = { validEmail, validPhone, lifetime, fail, hash, deliver };
