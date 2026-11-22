const express = require("express");
const router = express.Router();
const userDataController = require("../controllers/userDataController");
const upload = require("../middlewares/multer.js");

function scalarForm(req,res,next) {
  if (Object.values(req.body || {}).some(value => typeof value !== "string")) return res.sendStatus(400);
  next();
}
const {requireUser,requireAlumni,requireMember} = require("../middlewares/identity");
const otp = require("../controllers/otpController");
router.get("/getUsersData", requireUser, requireMember, userDataController.getUsersData);
router.get("/userData", requireUser, requireMember, userDataController.getUsersData);
router.post("/userData", requireUser, requireAlumni, upload.single("profile_img"), scalarForm, userDataController.createUsersData);
router.post("/otp/send", requireUser, requireAlumni, otp.send);
router.post("/otp/verify", requireUser, requireAlumni, otp.verifySignup);
router.get("/getUsersCompleteData/:roll_no", requireUser, requireMember, userDataController.getUsersCompleteData);
router.post("/profile", requireUser, requireMember, userDataController.getProfileData);
router.post("/wordEntered", requireUser, requireMember, userDataController.getWordEntered);
router.post("/searchword", requireUser, requireMember, userDataController.getSearchWord);
router.post("/findAUser", requireUser, requireMember, userDataController.findAUser);
router.put(
  "/updateUser", requireUser, requireAlumni, requireMember, otp.verifyEdit,
  upload.single("profile_img"), scalarForm,
  userDataController.updateUser,
);

module.exports = router;
