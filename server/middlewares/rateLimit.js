function rateLimit(limit, keyFor) {
  let reset = 0;
  const counts = new Map();
  const overflow = Symbol("excess clients");

  return (req, res, next) => {
    const now = Date.now();
    if (now >= reset) {
      reset = now + 60000;
      counts.clear();
    }
    const caller = keyFor(req);
    const key = counts.size < 10000 || counts.has(caller) ? caller : overflow;
    const count = (counts.get(key) || 0) + 1;
    if (count > limit) {
      res.set("Retry-After", String(Math.ceil((reset - now) / 1000)));
      return res.status(429).json({ message: "Too many requests. Try again shortly." });
    }
    counts.set(key, count);
    next();
  };
}

exports.byPeer = (limit) => rateLimit(limit, (req) => req.socket.remoteAddress);
exports.byAccount = (limit) => rateLimit(limit, (req) => req.user.jti);
