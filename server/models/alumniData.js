const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    roll_no: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    academic_program: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "alumniData",
  },
);

module.exports = mongoose.model("AlumniData", alumniSchema);
