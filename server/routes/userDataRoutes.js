const express = require("express");
const router = express.Router();
const userDataController = require("../controllers/userDataController");
const upload = require("../middlewares/multer.js");

router.route("/userData").get(userDataController.getUsersData);

router.post(
  "/userData",
  upload.single("profile_img"),
  userDataController.createUsersData,
);

router.get("/verify/:id", userDataController.verify);
router.post("/profile", userDataController.getProfileData);
router.post("/wordEntered", userDataController.getWordEntered);
router.post("/searchword", userDataController.getSearchWord);
router.post("/findAUser", userDataController.findAUser);
router.post("/verify", userDataController.verifyPhoneOtp);
router.post("/resendMail", userDataController.resendMail);
router.put(
  "/updateUser",
  upload.single("profile_img"),
  userDataController.updateUser,
);

router.get("/getUsersData", userDataController.getUsersData);
router.post("/getUsersDatanew", userDataController.getUsersDatanew);
router.post("/userDataNew", userDataController.userDataNew);
router.post("/userDataemail", userDataController.userDataNewemail);

module.exports = router;
