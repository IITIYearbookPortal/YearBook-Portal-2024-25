const path = require("node:path");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const Users = require("../models/userModel");
const storage = require("../config/storage");

const getUsersData = asyncHandler(async (req, res) => {
  //Get all usersData from MongoDb
  const User = await Users.find({one_step_verified:true,two_step_verified:true});

  //If no usersData
  if (!User?.length) {
    return res.send({ message: "No userData found" });
  }
  // Map over each user to extract only the necessary data
  const userData = User.map((user) => ({
    _id: user.id,
    email: user.email,
    name: user.name,
    roll_no: user.roll_no,
    department: user.department,
    academic_program: user.academic_program,
    profile_img: user.profile_img.url,
    profile_img_pubId: user.profile_img.public_id,
  }));

  return res.send(userData);
});

const getUsersCompleteData = asyncHandler(async (req, res) => {
  const { roll_no } = req.params;
  if (roll_no !== req.profile?.roll_no) return res.sendStatus(403);
  const user = await Users.findById(req.profile._id);
  if (!user) {
    return res.status(404).json({ message: "No userData found" });
  }
  return res.json({ user });
});

//Add a New User
const createUsersData = asyncHandler(async (req, res) => {
  const {
    name,
    roll_no,
    academic_program,
    department,
    personal_email_id,
    contact_details,
    alternate_contact_details,
    address,
    current_company,
    designation,
    about,
    question_1,
    question_2,
  } = req.body;

  const email = req.user.email;
  if (req.profile) return res.status(409).json({message:"Profile already exists"});
  if (!validEmail(personal_email_id) || !validPhone(contact_details)) return res.status(400).json({message:"Invalid contact details"});
  if (!req.file) {
    return res.status(400).json({ message: "Profile image is required" });
  }

  if (
    !email ||
    !name ||
    !roll_no ||
    !academic_program ||
    !department ||
    !contact_details ||
    !alternate_contact_details ||
    !address ||
    !personal_email_id ||
    !about ||
    !question_1 ||
    !question_2
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (await Users.findOne({ personal_email_id })) {
    return res.json({ message: "Personal Email Id is already in use" });
  }

  if (await Users.findOne({ contact_details })) {
    return res.json({ message: "Mobile Number is already in use" });
  }

  if (!/^\d+$/.test(roll_no)) {
    return res.json({ message: "Roll No. should be in Digits" });
  }

  if (await Users.findOne({ roll_no })) {
    return res.json({ message: "Roll_No is already in use" });
  }

  let uploadResult;
  try {
    const ext = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
    uploadResult = await storage.uploadImage(req.file.buffer, {
      folder: "yearbook/signup",
      mimeType: req.file.mimetype || "image/jpeg",
      ext,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }

  try {
    await Users.create({
      indexedEnrollment: true,
      email,
      name,
      roll_no,
      academic_program,
      department,
      contact_details,
      alternate_contact_details,
      address,
      personal_email_id,
      current_company,
      designation,
      about,
      profile_img: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      },
      question_1,
      question_2,
      one_step_verified: false,
      two_step_verified: false,
    });
  } catch (err) {
    await storage.deleteImage(uploadResult.public_id).catch(() => {});
    return res
      .status(err.code === 11000 ? 409 : 500)
      .json({ message: "Could not create profile" });
  }
  return res.json({
    message: "Profile created",
  });
});

const {validEmail,validPhone} = require("../utils/otp");
const streamifier = require("streamifier");


const updateUser = asyncHandler(async (req, res) => {
  const {
    email,
    name,
    roll_no,
    academic_program,
    department,
    address,
    current_company,
    designation,
    about,
    question_1,
    question_2,
  } = req.body;

  if (
    !email ||
    !name ||
    !roll_no ||
    !academic_program ||
    !department ||
    !address ||
    !about ||
    !question_1 ||
    !question_2
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!/^\d+$/.test(roll_no)) {
    return res.status(400).json({ message: "Roll No. should be numeric" });
  }

  const user = await Users.findById(req.profile._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (roll_no !== user.roll_no) return res.status(400).json({message:"Roll number cannot be changed"});
  let previousImage;
  let newUploadedPublicId;
  if (req.file) {
    const ext = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
    const uploadResult = await storage.uploadImage(req.file.buffer, {
      folder: "yearbook/signup",
      mimeType: req.file.mimetype || "image/jpeg",
      ext,
    });

    previousImage = user.profile_img?.public_id;
    newUploadedPublicId = uploadResult.public_id;
    user.profile_img = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  }

  user.name = name;
  // Roll numbers identify profiles across comments and directory links.
  user.academic_program = academic_program;
  user.department = department;
  user.address = address;
  user.current_company = current_company;
  user.designation = designation;
  user.about = about;
  user.question_1 = question_1;
  user.question_2 = question_2;

  try {
    await user.save();
  } catch (err) {
    if (newUploadedPublicId) {
      await storage.deleteImage(newUploadedPublicId).catch(() => {});
    }
    throw err;
  }
  if (previousImage) await storage.deleteImage(previousImage).catch(() => {});

  res.status(200).json({
    message: "User data updated successfully",
    user,
  });
});

//find a user who logged in in user's data
const findAUser = asyncHandler(async (req, res) => {
  const email = req.user.email;

  const User = await Users.find({ email: email }).exec();

  const User2 = User.map((user) => ({
    name: user.name,
    email: user.email,
    roll_no: user.roll_no,
    academic_program: user.academic_program,
    dpeartment: user.department,
    about: user.about,
    profile_img: user.profile_img.url,
    profile_img_pubId: user.profile_img.public_id,
    one_step_verified: user.one_step_verified,
    two_step_verified: user.two_step_verified,
  }));

  if (!User.length) {
    res.send({ message: "No user Found" });
  } else {
    res.send({ message: "User Found", User2 });
  }
});

//Get Users data who has logged in to be displayed on the profile page
const getProfileData = asyncHandler(async (req, res) => {
  const email = req.user.email;

  const User = await Users.find({ email: email }).exec();

  if (!User.length) {
    res.send({ message: "No User Found" });
  } else {
    res.send({ message: "User Found", User: User });
  }
});

//Get a list of users whose name start with the word entered on the searchbar
const getWordEntered = asyncHandler(async (req, res) => {
  const wordEntered = req.body.wordentered;

  if (typeof wordEntered !== "string" || wordEntered.length === 0) {
    return res.send([]);
  }

  const User = await Users.find({
    one_step_verified:true, two_step_verified:true,
    name: { $regex: new RegExp("^" + wordEntered.slice(0,80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
  }).select("name email roll_no department academic_program profile_img about").limit(50).exec();

  if (!User?.length) {
    return res.send([]);
  }

  res.send(User);
});

//Get the Users data who is being searched
const getSearchWord = asyncHandler(async (req, res) => {
  const searchWord = req.body.searchword;

  if (typeof searchWord !== "string") return res.sendStatus(400);
  const User = await Users.find({ email: searchWord, one_step_verified:true,two_step_verified:true });

  if (!User?.length) {
    return res.send({});
  }

  // Map over each user to extract only the necessary data
  const userData = User.map((user) => ({
    email: user.email,
    name: user.name,
    roll_no: user.roll_no,
    academic_program: user.academic_program,
    department: user.department,
    about: user.about,
    profile_img: user.profile_img.url,
    profile_img_pubId: user.profile_img.public_id,
  }));

  res.send(userData);
});

//delete a user

// const deleteUser = asyncHandler(async (req, res) => {
//   const email = req.body.email
//   console.log(email)
//   const User = await Users.find({ email: email }).exec()

//   if (!User?.length) {
//     return res.send({ message: 'User Not Found' })
//   }

//   const del = Users.deleteOne({ email: email }, function (err, result) {
//     res.send(result === 1 ? { msg: 'Deleted' } : { msg: 'error: ' + err })
//   })

//   // return res.send({message: "User deleted"});
// })

module.exports = {
  getUsersCompleteData,
  getUsersData,
  createUsersData,
  updateUser,
  getProfileData,
  getWordEntered,
  getSearchWord,
  findAUser,
  // deleteUser
};
