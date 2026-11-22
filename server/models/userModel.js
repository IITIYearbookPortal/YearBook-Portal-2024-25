const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: [true, "Name is Required"],
  },

  roll_no: {
    type: String,
    required: [true, "Roll Number is required"],
    immutable: true,
  },
  indexedEnrollment: {type:Boolean, select:false},

  academic_program: {
    type: String,
    default: "Bachelor of Technology (BTech)",
  },

  department: {
    type: String,
    required: [true, "Department is required"],
  },

  contact_details: {
    type: String,
    required: [true, "Contact_Details is required"],
  },

  alternate_contact_details: {
    type: String,
    required: [true, "Alternate Contact Details is required"],
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
    url: { type: String, required: true },
    public_id: { type: String, required: true },
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

  phoneOTP: {type:String,select:false},
  otp: {type: new mongoose.Schema({
    purpose:String, destination:String, session:String, nonce:String, hash:String,
    remaining:Number, expires:Date, issued:Date
  }, {_id:false}), select:false},
  emailOtpVerifiedAt: {type:Date},

});

// Legacy duplicate rolls need reconciliation before a full unique index can be built.
userSchema.index({roll_no:1}, {unique:true, partialFilterExpression:{indexedEnrollment:true}});
module.exports = mongoose.models.Users || mongoose.model("Users", userSchema);
