const router = require("express").Router();
const auth = require("../controllers/authController");
const { requireUser } = require("../middlewares/identity");
router.post("/auth/login", auth.login);
router.get("/auth/session", requireUser, auth.session);
router.post("/auth/logout", auth.logout);
module.exports = router;
