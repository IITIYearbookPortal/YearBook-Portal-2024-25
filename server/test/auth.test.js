const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync } = require("node:crypto");
const jwt = require("jsonwebtoken");
process.env.CLIENT_LINK = "https://portal.example.invalid";
process.env.GOOGLE_CLIENT_ID = "fixture-client";
const { app } = require("../server");
const mongoose = require("mongoose");
const Auth = require("../models/authModel");
const User = require("../models/userModel");
const { googleIdentity } = require("../utils/token.util");
const { digest } = require("../middlewares/identity");
const Session = mongoose.model("PortalSession");
let server, origin;
before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  origin = "http://127.0.0.1:" + server.address().port;
});
after(() => new Promise((resolve) => server.close(resolve)));

test("Google credentials are restricted to this portal and valid lifetimes", async (t) => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  t.mock.method(
    global,
    "fetch",
    async () =>
      new Response(
        JSON.stringify({
          fixture: publicKey.export({ type: "spki", format: "pem" }),
        }),
      ),
  );
  const sign = (aud, expiresIn) =>
    jwt.sign({ sub: "fixture-user" }, privateKey, {
      algorithm: "RS256",
      keyid: "fixture",
      issuer: "accounts.google.com",
      audience: aud,
      expiresIn,
    });
  assert.equal(
    (await googleIdentity(sign("fixture-client", "2m"))).sub,
    "fixture-user",
  );
  await assert.rejects(googleIdentity(sign("other-client", "2m")));
  await assert.rejects(googleIdentity(sign("fixture-client", -1)));
});

test("signed-out requests cannot reach private records, moderation, uploads or votes", async () => {
  for (const [method, path] of [
    ["GET", "/auth/session"],
    ["GET", "/getUsersData"],
    ["POST", "/editComment"],
    ["POST", "/userData"],
    ["POST", "/create-memory"],
    ["POST", "/votePoll"],
  ]) {
    const res = await fetch(origin + path, {
      method,
      headers: { Origin: process.env.CLIENT_LINK, "X-Yearbook-Request": "1" },
    });
    assert.equal(res.status, 401, path);
  }
});

test("cookie-authenticated writes require the portal origin and request header", async () => {
  const res = await fetch(origin + "/auth/logout", {
    method: "POST",
    headers: { Origin: process.env.CLIENT_LINK },
  });
  assert.equal(res.status, 403);
});

test("session restores the owner and limits profile, inbox and poll administration", async (t) => {
  const account = {
    _id: "fixture-account",
    email: "owner@example.invalid",
    name: "Owner",
  };
  const profile = {
    _id: "fixture-profile",
    email: account.email,
    name: "Owner",
    roll_no: "101",
    one_step_verified: true,
    two_step_verified: true,
  };
  t.mock.method(Session, "findOne", (filter) => ({
    lean: async () =>
      filter._id === digest("fixture-session") &&
      filter.expires.$gt instanceof Date
        ? { account: account._id, alumni: true }
        : null,
  }));
  t.mock.method(Auth, "findById", (id) => ({
    lean: async () => (id === account._id ? account : null),
  }));
  t.mock.method(User, "findOne", () => ({ lean: async () => profile }));
  t.mock.method(User, "findById", async (id) =>
    id === profile._id ? profile : null,
  );
  const headers = {
    Cookie: "yearbook_session=fixture-session",
    Origin: process.env.CLIENT_LINK,
    "X-Yearbook-Request": "1",
    "Content-Type": "application/json",
  };
  const state = await fetch(origin + "/auth/session", { headers });
  assert.equal((await state.json()).user.email, account.email);
  const self = await fetch(origin + "/getUsersCompleteData/101", { headers });
  assert.equal((await self.json()).user.roll_no, "101");
  for (const [method, path, body] of [
    ["GET", "/getUsersCompleteData/202"],
    ["GET", "/memories/get-pending-requests/other@example.invalid"],
    ["DELETE", "/polls/fixture"],
    ["POST", "/setRejectedComments", { comment_reciever_roll_no: "202" }],
  ]) {
    assert.equal(
      (
        await fetch(origin + path, {
          method,
          headers,
          body: JSON.stringify(body),
        })
      ).status,
      403,
      path,
    );
  }
  const withoutEditCode = await fetch(origin + "/updateUser", {method:"PUT",headers});
  assert.equal(withoutEditCode.status,400);
  profile.one_step_verified = false;
  assert.equal(
    (await fetch(origin + "/getUsersData", { headers })).status,
    403,
  );
});

test("logout expires the cookie and removes its server-side digest", async (t) => {
  let deleted;
  t.mock.method(Session, "deleteOne", async (filter) => {
    deleted = filter._id;
  });
  const res = await fetch(origin + "/auth/logout", {
    method: "POST",
    headers: {
      Origin: process.env.CLIENT_LINK,
      "X-Yearbook-Request": "1",
      Cookie: "yearbook_session=fixture-token",
    },
  });
  assert.equal(res.status, 204);
  assert.equal(deleted, digest("fixture-token"));
  assert.match(res.headers.get("set-cookie"), /HttpOnly/i);
});

test("50 concurrent session restores keep their synthetic account identities separate", async (t) => {
  const records = new Map();
  const clients = Array.from({ length: 50 }, (_, index) => {
    const key = "test-session-" + index;
    const email = "member" + index + "@example.invalid";
    records.set(digest(key), { account: email, alumni: false });
    return { key, email };
  });
  t.mock.method(Session, "findOne", (filter) => ({
    lean: async () => records.get(filter._id),
  }));
  t.mock.method(Auth, "findById", (email) => ({
    lean: async () => ({ _id: email, email, name: "Member" }),
  }));
  await Promise.all(
    clients.map(async ({ key, email }) => {
      const res = await fetch(origin + "/auth/session", {
        headers: { Cookie: "yearbook_session=" + key },
      });
      assert.equal(res.status, 200);
      assert.equal((await res.json()).user.email, email);
    }),
  );
});

test("signup email codes update only their proved destination and can be consumed once", async (t) => {
  const otp = require("../utils/otp");
  const controller = require("../controllers/otpController");
  process.env.OTP_SECRET = "test-only-fixture-secret-for-verification";
  const challenge = {
    nonce: "fixture",
    destination: "personal@example.invalid",
    hash: otp.hash("fixture", "123456"),
  };
  let consumed = false;
  t.mock.method(User, "findOneAndUpdate", (filter, update) => {
    assert.deepEqual(filter["otp.remaining"], { $gt: 0 });
    assert.equal(filter["otp.session"], "session-digest");
    assert.equal(filter["otp.purpose"], "signup-email");
    assert.ok(filter["otp.expires"].$gt instanceof Date);
    assert.equal(update.$inc["otp.remaining"], -1);
    return {
      select: () => ({
        lean: async () =>
          consumed ? null : { _id: "fixture-profile", otp: challenge },
      }),
    };
  });
  t.mock.method(User, "updateOne", async (filter, update) => {
    assert.equal(filter["otp.hash"], challenge.hash);
    assert.equal(update.$set.personal_email_id, challenge.destination);
    assert.equal(update.$set.two_step_verified, true);
    assert.ok(update.$unset.otp);
    consumed = true;
    return { modifiedCount: 1 };
  });
  const req = {
    profile: {
      _id: "fixture-profile",
      one_step_verified: true,
      personal_email_id: challenge.destination,
    },
    sessionHash: "session-digest",
    body: { purpose: "signup-email", code: "123456" },
  };
  let status;
  const invoke = () =>
    controller.verifySignup(
      req,
      {
        sendStatus: (n) => {
          status = n;
        },
      },
      (err) => {
        status = err.status;
      },
    );
  await invoke();
  assert.equal(status, 204);
  await invoke();
  assert.equal(status, 403);
});

test("MSG91 delivery uses the direct SendOTP API and the configured template", async (t) => {
  const otp = require("../utils/otp");
  process.env.MSG91_AUTH_KEY = "fixture-only";
  process.env.MSG91_TEMPLATE_ID = "fixture-template";
  t.mock.method(global, "fetch", async (url, options) => {
    assert.equal(url.origin, "https://control.msg91.com");
    assert.equal(url.pathname, "/api/v5/otp");
    assert.equal(url.searchParams.get("mobile"), "12025550100");
    assert.equal(url.searchParams.get("template_id"), "fixture-template");
    assert.equal(options.headers.authkey, "fixture-only");
    return new Response(
      JSON.stringify({ type: "success", request_id: "fixture" }),
    );
  });
  await otp.deliver("signup-phone", "+12025550100", "123456");
});

test("SMTP sends edit codes through the configured TLS relay", async (t) => {
  const mail = require("nodemailer");
  Object.assign(process.env, {
    SMTP_HOST: "relay.example.invalid",
    SMTP_PORT: "587",
    SMTP_USER: "fixture",
    SMTP_PASS: "fixture",
    SMTP_FROM: "yearbook@example.invalid",
  });
  let delivery;
  t.mock.method(mail, "createTransport", (options) => {
    assert.equal(options.host, process.env.SMTP_HOST);
    assert.equal(options.requireTLS, true);
    return {
      sendMail: async (message) => {
        delivery = message;
      },
    };
  });
  await require("../utils/otp").deliver(
    "edit-profile",
    "member@example.invalid",
    "123456",
  );
  assert.equal(delivery.to, "member@example.invalid");
  assert.equal(delivery.from, process.env.SMTP_FROM);
  assert.match(delivery.text, /123456/);
});
