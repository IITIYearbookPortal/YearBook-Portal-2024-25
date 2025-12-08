const mongoose = require('mongoose');

const SeniorsSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },

  roll_no: {
    type: String,
    required: true,
  },

  profile_pic: { type: String },

  academic_program: {
    type: String,
    default: "Bachelor of Technology (BTech)",
  },

  department: {
    type: String,
    required: true,
  },

  about: {
    type: String,
    required: true,
  },

  students_testimonial: {
    type: String,
    required: true,
  },

  testimonial_count: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Seniors", SeniorsSchema);
