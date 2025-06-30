const asyncHandler = require('express-async-handler')
require('dotenv').config()
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const Users = require('../models/userModel')
const jwtutil = require("../utils/token.util");
// adding environment variable ****************
const gmailUser = process.env.GMAIL_USER
const gmailPass = process.env.GMAIL_PASS
const serverLink = process.env.SERVER_LINK
const clientLink = process.env.CLIENT_LINK

//Api to set up sender to send a mail
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {

    user: gmailUser,

    pass: gmailPass,
  },
})


//Geeting all the users data who have created their profile
const getUsersData = asyncHandler(async (req, res) => {
  //Get all usersData from MongoDb
  const User = await Users.find()

  //If no usersData
  if (!User?.length) {
    return res.status(404).json({ message: 'No userData found' })
  }
  // Map over each user to extract only the necessary data
  const userData = User.map(user => ({
    _id : user.id,
    email: user.email,
    name: user.name,
    roll_no: user.roll_no,
    department :user.department,
    academic_program: user.academic_program,
    profile_img: user.profile_img

  }))

  return res.status(200).json(userData)
})

const getUsersDatanew = asyncHandler(async (req, res) => {
  //Get all usersData from MongoDb
  const tokenEmail = req.tokenEmail; // Email from middleware
  const email = req.body.email
  // const personal_email_id = req.body.personal_email_id
  // const contact_details = req.body.contact_details

  // Authorization check - users can only access their own data
  if (tokenEmail !== email) {
    return res.status(403).json({ message: 'You are not authorized to access this user data' });
  }

  const User = await Users.findOne({email : email})

  // User.personal_email_id = personal_email_id
  // User.contact_details = contact_details

  //If no usersData
  if (!User?.length) {
    return res.status(404).json({ message: 'No userData found' })
  }
  // Map over each user to extract only the necessary data

  return res.status(200).json(User)
})

const userDataNew = asyncHandler(async (req, res) => {
  //Get all usersData from MongoDb
  const email = req.body.email
  const personal_email_id = req.body.personal_email_id
  const contact_details = req.body.contact_details

  console.log(req.body)

  if (email !== req.tokenEmail) {
    return res.status(403).json({ message: 'You are not authorized to update this user data' });
  }

  const User = await Users.findOneAndUpdate({email : email}, {$set: {personal_email_id: personal_email_id , contact_details:contact_details}})

  // User.personal_email_id = personal_email_id
  // User.contact_details = contact_details

  //If no usersData
  // if (!User?.length) {
  //   return res.send({ message: 'No userData found' })
  // }
  // Map over each user to extract only the necessary data
  

  return res.status(200).json(User)
})

const userDataNewemail = asyncHandler(async (req, res) => {
  //Get all usersData from MongoDb
  const tokenEmail = req.tokenEmail; // Email from middleware
  const email = req.body.email
  const personal_email_id = req.body.personal_email_id
  
  // Authorization check - users can only update their own data
  if (tokenEmail !== email) {
    return res.status(403).json({ message: 'You are not authorized to update this user data' });
  }

  const User = await Users.findOneAndUpdate({email : email}, {$set: {personal_email_id: personal_email_id }})

  // User.personal_email_id = personal_email_id
  // User.contact_details = contact_details

  //If no usersData
  // if (!User?.length) {
  //   return res.send({ message: 'No userData found' })
  // }
  // Map over each user to extract only the necessary data
  

  return res.status(200).json(User)
})

//Add a New User
const createUsersData = asyncHandler(async (req, res) => {
  const {
    email,
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
    profile_img,
    question_1,
    question_2,
  } = req.body

  console.log(req.body)
  // Confirm data
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
    !profile_img ||
    !question_1 ||
    !question_2
  ) {
    return res.send({ message: 'All fields are required.' })
  }

  if (email !== req.tokenEmail) {
    return res.status(403).json({ message: 'You are not authorized to create this user.' });
  }

  // Check if email is in use
  const existingUser = await Users.find({personal_email_id: personal_email_id}).exec();
 
  if(existingUser.length!==0){
    return res.send({message:"Personal Email Id is already in use"});
}
  // Check if contact_no is in use
  const existingUser2 = await Users.findOne({contact_details: contact_details}).exec();
  
      if(existingUser2){
          return res.send({message:"Mobile Number is already in use"});
      }

  // check if roll no. is a number or not
  if (isNaN(roll_no)) {
    return res.send({ message: 'Roll No. should be in Digits' })
  }

  //Check if roll.no is in use
  const existingUser3 = await Users.findOne({roll_no: roll_no}).exec();
      console.log(existingUser3)
      console.log("3")
      if(existingUser3){
          return res.send({message:"Roll_No is already in use"});
      }

  // Create and store the new user
  const usersData = await Users.create({
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
    profile_img,
    question_1,
    question_2,
  }) 

  if (usersData) {
    //created
    console.log("created")
    return res.status(200).json({message:"Sent an OTP to your contact number."})
    
  } else {
    return res.send({ message: 'Invalid Userdata Recieved' })
  }
})

// ---------------------- verify phone otp -------------------------

const verifyPhoneOtp = async (req, res, next) => {
  try {
    const userId = req.body.userId
    if (req.tokenEmail !== userId) {
      return res.status(403).json({ message: 'You are not authorized to verify this user' });
    }
    const user = await Users.findOne({ email: userId }).exec()
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    user.one_step_verified = true
    await user.save()

    const verificationToken = user.generateVerificationToken()
    try {
      //Email the user a unique verification link
      const url = `${serverLink}/verify/${verificationToken}`
      console.log('Reaches')
      transporter.sendMail({
        to: user.personal_email_id,
        subject: 'Verify Account',
        // html: `Click <a href='${url}'>here</a> to confirm your email.`,
        html: `<p>Thank you for registering on the Yearbook Portal.<br/>
        
        It's a pleasure to have you join the Alumni Community of IIT Indore! We congratulate you on your graduation!<br/>
        To stay connected with your Batch and the Institute, we urge you to create your profile on the Alumni Portal by visiting
        <a href='https://alumni.iiti.ac.in/'>Alumni Portal Link</a><br/>
        You can connect with us on LinkedIn to ensure all your updates can be featured on the Official Page of the Alumni Cell.
      <a href = 'https://in.linkedin.com/company/alumni-cell-iit-indore'>LinkedIn</a></p><br/>
      Please verify your registered email by clicking on the link below.
        <a href='${url}'>Verify</a><br/>
      <p>Regards,<br/>
      The Alumni Cell,<br/>
      Indian Institute of Technology Indore</p>`,
      })

      return res.status(200).json({
        message: `Sent a verification email to your personal email_id`, user
      })
    } catch (err) {
      console.log(err)
    }
  } catch (error) {
    next(error)
  }
}

//Verify the personal_email_id
const verify = async (req, res) => {
  const token = req.params.id

  //Check if we have an id
  if (!token) {
    return res.status(200).json({ message: 'Missing token' })
  }

  //Verify the token from the URL
  let payload = null
  try {
    payload = jwt.verify(token, process.env.SECRET)
  } catch (err) {
    return res.send(err)
  }

  try {
    //Find user with matching ID
    const user = await Users.findOne({ _id: payload.ID }).exec()

    if (!user) {
      return res.status(200).json({ message: 'User does not exist' })
    }

    //Update user verification status to true
    user.two_step_verified = true
    await user.save()

    return res.redirect(`${clientLink}/blackcard`)
  } catch (err) {
    return res.status(500).send(err)
  }
}

//Resend Mail
const resendMail = asyncHandler(async (req, res) => {
  //Generate a veification token with th user's ID
  const userId = req.body.userId
  const personalMailId = req.body.personalMailId
  if (req.tokenEmail !== userId) {
    return res.status(403).json({ message: 'You are not authorized to resend mail for this user' });
  }
  const user = await Users.findOne({ email: userId }).exec()
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  const verificationToken = user.generateVerificationToken()
  try {
    //Email the user a unique verification link
    const url = `${serverLink}/verify/${verificationToken}`
    console.log('Reaches')
    transporter.sendMail({
      to: personalMailId,
      subject: 'Verify Account',
      // html: `Click <a href='${url}'>here</a> to confirm your email.`,
      html: `<p>Thank you for registering on the Yearbook Portal.<br/>
        
      It's a pleasure to have you join the Alumni Community of IIT Indore! We congratulate you on your graduation!<br/>
      To stay connected with your Batch and the Institute, we urge you to join the following WhatsApp Group-
      <a href='https://chat.whatsapp.com/JWVAs4MBiYJ9SkiMPRIro4'>Whatsapp Group Link</a><br/>
      We also urge you to create your profile on the Alumni Portal by visiting
      <a href='https://alumni.iiti.ac.in/'>Alumni Portal Link</a><br/>
      You can connect with us on LinkedIn to ensure all your updates can be featured on the Official Page of the Alumni Cell.
    <a href = 'https://in.linkedin.com/company/alumni-cell-iit-indore'>LinkedIn</a></p><br/>
    Please verify your registered email by clicking on the link below.
      <a href='${url}'>Verify</a><br/>
    <p>Regards,<br/>
    The Alumni Cell,<br/>
    Indian Institute of Technology Indore</p>`,
    })

    return res.status(200).json({
      message: `Sent a verification email to your personal email_id`,
    })
  } catch (err) {
    console.log(err)
  }
})

//Upadte users data
const updateUser = asyncHandler(async (req, res) => {
  const tokenEmail = req.tokenEmail; // Email from middleware
  
  const {
    email,
    name,
    roll_no,
    academic_program,
    department,
    /* personal_email_id,
    contact_details,
    alternate_contact_details, */
    address,
    current_company,
    designation,
    about,
    profile_img,
    question_1,
    question_2,
  } = req.body

  if (
    !email ||
    !name ||
    !roll_no ||
    !academic_program ||
    !department ||
    !address ||
    !about ||
    !profile_img ||
    !question_1 ||
    !question_2
  ) {
    return res.send({ message: 'All fields are required' })
  }
  if (tokenEmail !== email) {
    return res.status(403).json({ message: 'You are not authorized to update this user' })
  }
  // check if roll no. is a number or not
  if (isNaN(roll_no)) {
    return res.send({ message: 'Roll No. should be in Digits' })
  }

  const user = await Users.findOne({ email }) // find the user in the database by email

  // update user data
  user.name = name
  user.roll_no = roll_no
  user.academic_program = academic_program
  user.department = department
  // user.personal_email_id = personal_email_id
  // user.contact_details = contact_details
  // user.alternate_contact_details = alternate_contact_details
  user.address = address
  user.current_company = current_company
  user.designation = designation
  user.about = about
  user.profile_img = profile_img
  user.question_1 = question_1
  user.question_2 = question_2

  await user.save() // save the updated user data

  res.status(200).json({ message: 'User data updated successfully', user })
})

//find a user who logged in in user's data
const findAUser = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware
  
  const User = await Users.find({ email: email }).exec()

  const User2 = User.map(user => ({
    name : user.name,
    email : user.email,
    roll_no: user.roll_no,
    academic_program : user.academic_program,
    dpeartment : user.department,
    about : user.about,
    profile_img : user.profile_img,
    one_step_verified: user.one_step_verified,
    two_step_verified : user.two_step_verified
  })) 

  if (!User.length) {
    return res.status(404).json({ message: 'No user Found' })
  } else {
    return res.status(200).json({ message: 'User Found', User2})
  }
})

//Get Users data who has logged in to be displayed on the profile page
const getProfileData = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware

  const User = await Users.find({ email: email }).exec()

  if (!User.length) {
    res.status(404).json({ message: 'No User Found' })
  } else {
    res.status(200).json({ message: 'User Found', User: User })
  }
})

//Get a list of users whose name start with the word entered on the searchbar
const getWordEntered = asyncHandler(async (req, res) => {
  const wordEntered = req.body.wordentered

  if (wordEntered.length === 0) {
    return res.send([])
  }

  const User = await Users.find({
    name: { $regex: new RegExp('^' + wordEntered + '.*', 'i') },
  }).exec()

  if (!User?.length) {
    return res.send([])
  }

  res.send(User)
})

//Get the Users data who is being searched
const getSearchWord = asyncHandler(async (req, res) => {
  const searchWord = req.body.searchword

  const User = await Users.find({ email: searchWord })

  if (!User?.length) {
    return res.send({})
  }

  // Map over each user to extract only the necessary data
  const userData = User.map(user => ({
    email:user.email,
    name: user.name,
    roll_no: user.roll_no,
    academic_program: user.academic_program,
    department: user.department,
    about: user.about,
    profile_img: user.profile_img
  }))

  res.send(userData)
})

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
  userDataNewemail,
  userDataNew,
  getUsersDatanew,
  getUsersData,
  createUsersData,
  updateUser,
  verify,
  getProfileData,
  getWordEntered,
  getSearchWord,
  findAUser,
  verifyPhoneOtp,
  resendMail,
  // deleteUser
}
