// const mongoose = require("mongoose");

// const alumniSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
// });

// module.exports = mongoose.model("Alumni", alumniSchema);

const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roll_no: String,
  },
  {
    collection: "alumniData",
  },
);

module.exports = mongoose.model("AlumniData", alumniSchema);
