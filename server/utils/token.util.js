const jwt = require("jsonwebtoken");
let cachedCertificates;
let refresh;
const googleKeys = "https://www.googleapis.com/oauth2/v1/certs";

async function getCertificates() {
  if (cachedCertificates && Date.now() < cachedCertificates.expires) return cachedCertificates;
  if (!refresh) {
    refresh = fetch(googleKeys, {signal: AbortSignal.timeout(5000)})
      .then(async response => {
        if (!response.ok) throw new Error("Identity provider unavailable");
        const ttl = Number(/max-age=(\d+)/.exec(response.headers.get("cache-control"))?.[1] || 60);
        cachedCertificates = {keys: await response.json(), expires: Date.now() + ttl * 1000};
        return cachedCertificates;
      })
      .finally(() => { refresh = undefined; });
  }
  return refresh;
}

async function verifyIdentity(token, audience, issuer) {
  if (!audience)
    throw Object.assign(new Error("Identity provider is not configured"), {
      status: 503,
    });
  const header =
    typeof token === "string" && token.length <= 8192 &&
    jwt.decode(token, { complete: true })?.header;
  if (!header || header.alg !== "RS256" || typeof header.kid !== "string")
    throw new Error("Invalid credential");
  const entry = await getCertificates();
  if (!Object.hasOwn(entry.keys, header.kid)) throw new Error("Unknown key");
  const claims = jwt.verify(token, entry.keys[header.kid], {
    algorithms: ["RS256"],
    issuer,
    audience,
  });
  if (
    typeof claims.exp !== "number" ||
    typeof claims.iat !== "number" ||
    claims.iat > Date.now() / 1000 ||
    typeof claims.sub !== "string" ||
    !claims.sub
  )
    throw new Error("Invalid claims");
  return claims;
}

exports.googleIdentity = (token) =>
  verifyIdentity(
    token,
    process.env.GOOGLE_CLIENT_ID,
    ["accounts.google.com", "https://accounts.google.com"],
  );
