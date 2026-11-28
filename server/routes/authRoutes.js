const router = require("express").Router();
const auth = require("../controllers/authController");
const { requireUser } = require("../middlewares/identity");
const { byPeer } = require("../middlewares/rateLimit");
router.post("/auth/login", byPeer(300), auth.login);
router.get("/auth/session", requireUser, auth.session);
router.post("/auth/logout", auth.logout);
module.exports = router;
