// const mongoose = require('mongoose')

// const commentsSchema = new mongoose.Schema({
//   comment_reciever_id: String,
//   comment_reciever_name: String,
//   comment_reciever_roll_no: Number,
//   comment_reciever_email_id: String,
//   comment_reciever_academic_program: String,

//   comment_sender: [
//     {
//       id: String,
//       name: String,
//       roll_no: Number,
//       email_id: String,
//       academic_program: String,
//       comment: String,
//       status: String,
//     },
//   ],
// })

// module.exports = mongoose.model('Comments', commentsSchema)


const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
  comment_reciever_id: { type: String, ref: "Users" },

  comment_sender: [
    {
      id: { type: String, ref: "Users" },
      comment: String,
      status: String,
      order: Number, // Add the order field to store the order of comments
    },
  ],
  comment_sender_student: [
    {
      id: { type: String, ref: "Auth" },
      comment: String,
      status: String,
      order: Number, // Add the order field to store the order of comments
    },
  ],
});

module.exports = mongoose.model('Comments', commentsSchema)


