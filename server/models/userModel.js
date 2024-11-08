const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: [true, 'Name is Required'],
  },

  roll_no: {
    type: String,
    required: [true, 'Roll Number is required'],
    // unique: true,
  },

  academic_program: {
    type: String,
    default: 'Bachelor of Technology (BTech)',
  },

  department: {
    type: String,
    required: [true, 'Department is required'],
  },

  contact_details: {
    type: String,
    required: [true, 'Contact_Details is required'],
  },

  alternate_contact_details: {
    type: String,
    required: [true, 'Alternate Contact Details is required'],
  },

  personal_email_id: {
    type: String,
    // required: [true, "Department is required"],
    // unique: true,
  },

  address: {
    type: String,
  },

  current_company: {
    type: String,
  },

  designation: {
    type: String,
  },

  about: {
    type: String,
    required: true,
  },

  profile_img: {
    type: String,
    // required: [true, "Profile_image is required"],
  },

  one_step_verified: {
    type: Boolean,
    required: true,
    default: false,
  },

  two_step_verified: {
    type: Boolean,
    required: true,
    default: false,
  },

  question_1: {
    type: String,
    required: true,
  },

  question_2: {
    type: String,
    required: true,
  },

  phoneOTP: String,
})

userSchema.methods.generateVerificationToken = function () {
  const user = this
  const verificationToken = jwt.sign({ ID: user._id }, process.env.SECRET, {
    expiresIn: '7d',
  })

  return verificationToken
}

module.exports = mongoose.model('Users', userSchema)
