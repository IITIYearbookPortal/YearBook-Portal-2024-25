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
    const authKey = process.env.MSG91_AUTH_KEY || process.env.OTP_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID || process.env.OTP_TEMPLATE_ID;
    if (!authKey || !templateId)
      throw fail(503, "SMS verification is not configured");
    const url = new URL("https://control.msg91.com/api/v5/otp");
    url.search = new URLSearchParams({
      template_id: templateId,
      mobile: destination.slice(1),
      otp: code,
      otp_length: "6",
      otp_expiry: "5",
    });
    const response = await fetch(url, {
      method: "POST",
      headers: { authkey: authKey, "content-type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok || (await response.json()).type !== "success")
      throw fail(503, "SMS delivery unavailable");
    return;
  }
  const host =
    process.env.SMTP_HOST ||
    (process.env.GMAIL_USER ? "smtp.gmail.com" : null);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS;
  const from = process.env.SMTP_FROM || process.env.GMAIL_USER;
  const port = Number(
    process.env.SMTP_PORT || (host === "smtp.gmail.com" ? 465 : 587),
  );
  if (!host || !from || !user || !pass)
    throw fail(503, "Email verification is not configured");
  smtp ||= nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
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
    from,
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
function widgetConfig() {
  const widgetId = process.env.MSG91_WIDGET_ID;
  const tokenAuth = process.env.MSG91_WIDGET_TOKEN;
  return widgetId && tokenAuth ? { widgetId, tokenAuth } : null;
}

async function verifyWidgetPhone(accessToken, destination) {
  const authkey = process.env.MSG91_AUTH_KEY;
  if (!widgetConfig() || !authkey)
    throw fail(503, "MSG91 phone verification is not configured");
  if (
    typeof accessToken !== "string" ||
    accessToken.length > 4096 ||
    !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(accessToken)
  )
    throw fail(400, "Invalid phone verification token");

  let response, result;
  try {
    response = await fetch("https://api.msg91.com/api/v5/widget/verifyAccessToken", {
      method: "POST",
      headers: { authkey, "content-type": "application/json" },
      body: JSON.stringify({ "access-token": accessToken }),
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    result = await response.json();
  } catch {
    throw fail(503, "MSG91 phone verification is unavailable");
  }
  if (!response.ok || /authkey|authentication failure/i.test(String(result?.message)))
    throw fail(503, "MSG91 phone verification is unavailable");
  if (
    result?.type !== "success" ||
    (result.message !== destination && result.message !== destination.slice(1))
  )
    throw fail(403, "Verification did not match this phone number or has expired");
}

module.exports = {
  validEmail, validPhone, lifetime, fail, hash, deliver, widgetConfig, verifyWidgetPhone,
};
