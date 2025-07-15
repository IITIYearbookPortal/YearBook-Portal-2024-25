// const asyncHandler = require('express-async-handler')
// require('dotenv').config()
// const mongoose = require('mongoose')
// const Users = require('../models/userModel')
// const Comments = require('../models/comments')

// const comments = asyncHandler(async (req, res) => {
//     const comment_sender_id = req.body.comment_sender_id
//     const comment_sender_name = req.body.comment_sender_name
//     const comment_sender_roll_no = req.body.comment_sender_roll_no
//     const comment_sender_email_id = req.body.comment_sender_email_id
//     const comment_sender_academic_program =
//         req.body.comment_sender_academic_program
//     const comment_reciever_id = req.body.comment_reciever_id
//     const comment_reciever_name = req.body.comment_reciever_name
//     const comment_reciever_roll_no = req.body.comment_reciever_roll_no
//     const comment_reciever_email_id = req.body.comment_reciever_email_id
//     const comment_reciever_academic_program =
//         req.body.comment_reciever_academic_program
//     const comment = req.body.comment
//     const status = req.body.status

//     const User = await Comments.find({
//         comment_reciever_email_id: comment_reciever_email_id,
//     })
//     try {
//         if (!User?.length) {
//             const newUser = await Comments.create({
//                 comment_reciever_id,
//                 comment_reciever_name,
//                 comment_reciever_roll_no,
//                 comment_reciever_email_id,
//                 comment_reciever_academic_program,
//             })

//             const newUser2 = await Comments.findOneAndUpdate(
//                 { comment_reciever_email_id: newUser.comment_reciever_email_id },
//                 {
//                     $push: {
//                         comment_sender: {
//                             id: comment_sender_id,
//                             name: comment_sender_name,
//                             roll_no: comment_sender_roll_no,
//                             email_id: comment_sender_email_id,
//                             comment: comment,
//                             status: status,
//                             academic_program: comment_sender_academic_program,
//                         },
//                     },
//                 },
//             )

//             return res.send({ message: 'Comment added', newUser2 })
//         }

//         const newUser2 = await Comments.findOneAndUpdate(
//             { comment_reciever_email_id: User[0].comment_reciever_email_id },
//             {
//                 $push: {
//                     comment_sender: {
//                         id: comment_sender_id,
//                         name: comment_sender_name,
//                         roll_no: comment_sender_roll_no,
//                         email_id: comment_sender_email_id,
//                         academic_program: comment_sender_academic_program,
//                         comment: comment,
//                         status: status,
//                     },
//                 },
//             },
//         )
//         return res.send({ message: 'Comment added', newUser2 })
//     } catch (err) {
//     }
// })

// const getComments = asyncHandler(async (req, res) => {
//     const email = req.body.email;
//     //Get all Comments from MongoDb
//     // const User = await Comments.find()

//     const users = await Comments.find({
//         comment_sender: {
//             $elemMatch: {
//                 email_id: email,
//             },
//         },
//     });
//     let comments = [];
//     users.forEach((user) => {
//         const comment = user.comment_sender.find((sender) => sender.email_id === email);
//         if (comment) {
//             comments.push({ name: user.comment_reciever_name, comment: comment.comment });
//         }
//     });

//     //If no comments
//     if (!comments) {
//         return res.send({ message: 'No comments found' });
//     }
//     return res.send({ message: 'Comment found', User: comments });
// });

// const setApprovedComments = asyncHandler(async (req, res) => {
//     const comment_reciever_email_id = req.body.comment_reciever_email_id
//     const comment_sender_email_id = req.body.comment_sender_email_id
//     const comment = req.body.comment

//     const user = await Comments.find({
//         comment_reciever_email_id: comment_reciever_email_id,
//     })
//     if (!user?.length) {
//         return res.send({ message: 'No user found' })
//     }
//     for (var i = 0; i <= user[0].comment_sender.length; i++) {
//         if (
//             user[0].comment_sender[i].email_id === comment_sender_email_id &&
//             user[0].comment_sender[i].comment === comment
//         ) {
//             user[0].comment_sender[i].status = 'approved'
//             await user[0].save()
//             break
//         }
//     }
//     res.send({ message: 'comment added in approved section', user })
// })

// const setRejectedComments = asyncHandler(async (req, res) => {
//     const comment_reciever_email_id = req.body.comment_reciever_email_id
//     const comment_sender_email_id = req.body.comment_sender_email_id
//     const comment = req.body.comment

//     const user = await Comments.find({
//         comment_reciever_email_id: comment_reciever_email_id,
//     })
//     if (!user?.length) {
//         return res.send({ message: 'No user found' })
//     }

//     for (var i = 0; i <= user[0].comment_sender.length; i++) {

//         if (
//             user[0].comment_sender[i].email_id === comment_sender_email_id &&
//             user[0].comment_sender[i].comment === comment
//         ) {
//             user[0].comment_sender[i].status = 'rejected'

//             await user[0].save()
//             break
//         }
//     }
//     res.send({ message: 'comment added in rejected section', user })
// })

// const getRecieversComments = asyncHandler(async (req, res) => {
//     const comment_reciever_email_id = req.body.comment_reciever_email_id

//     //Get all usersData from MongoDb
//     const users = await Comments.find({ comment_reciever_email_id: comment_reciever_email_id })
//     //If no usersData
//     if (users.length === 0) {
//         return res.send({ message: 'No userData found' })
//     }
//     var approvedComments = []
//     users.map(user => {
//         approvedComments = user.comment_sender.filter(sender => sender.status === "approved")

//     })

//     const comments = [];

//     users.forEach(user => {
//         user.comment_sender.forEach(comment => {
//             if (comment.status === "new") {
//                 comments.push({ name: comment.name, comment: comment.comment, email_id: comment.email_id });
//             }

//         });
//     });
//     const approvedUsers = approvedComments.map(user => ({
//         name: user.name,
//         comment: user.comment,
//         email: user.email_id
//     }))

//     return res.send({ message: "Approved users found", users: approvedUsers, user2: comments })

// })

// const removeCommentFromMyComments = asyncHandler(async (req, res) => {
//     const email = req.body.email;
//     const comment = req.body.comment;

//     const users = await Comments.find({
//         comment_sender: {
//             $elemMatch: {
//                 email_id: email,
//                 comment: comment,
//             },
//         },
//     });

//     await Promise.all(users.map(async (user) => {
//         const commentIndex = user.comment_sender.findIndex((sender) => sender.email_id === email && sender.comment === comment);
//         if (commentIndex !== -1) {
//             user.comment_sender.pull(user.comment_sender[commentIndex]);
//             await user.save();
//         }
//     }));

//     res.send({ message: 'Comment removed successfully' });
// })

// const removeCommentFromApprovedComments = asyncHandler(async (req, res) => {
//     const comment_reciever_email_id = req.body.comment_reciever_email_id
//     const comment = req.body.comment
//     const email = req.body.email

//     //Get all usersData from MongoDb
//     const users = await Comments.find({ comment_reciever_email_id: comment_reciever_email_id })

//     //If no usersData
//     if (users.length === 0) {
//         return res.send({ message: 'No userData found' })
//     }
//     let commentRemoved = false;
//     await Promise.all(users.map(async (user) => {
//         const commentIndex = user.comment_sender.findIndex((sender) => sender.email_id === email && sender.comment === comment && sender.status === "approved");
//         if (commentIndex !== -1) {
//             user.comment_sender[commentIndex].status = "new"
//             await user.save();
//             commentRemoved = true;
//         }
//     }));

//     if (!commentRemoved) {
//         return res.send({ message: 'Comment not found in approved comments' });
//     }

//     return res.send({ message: "Comment removed from approved comments" })
// })

// module.exports = {
//     comments,
//     getComments,
//     setApprovedComments,
//     setRejectedComments,
//     getRecieversComments,
//     removeCommentFromMyComments,
//     removeCommentFromApprovedComments
// }

// --------------------------------------------------------------------------------------------------------------

const asyncHandler = require("express-async-handler");
const jwtutil = require("../utils/token.util");
require("dotenv").config();
const mongoose = require("mongoose");
const Users = require("../models/userModel");
const Comments = require("../models/comments");
const auth = require("../models/authModel");

//Adding the comment
const comments = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware
  const comment_sender_email_id = email;
  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comment = req.body.comment;
  const status = req.body.status;
  const isStudent = req.body.isStudent;

  if (comment === "") {
    return res.status(406).json({ statusmessage: "Comment cannot be empty" });
  }
  //finding id of receiver
  const receiver = await Users.findOne({
    roll_no: comment_reciever_roll_no,
  });

  comment_reciever_id = receiver._id.toString();

  var sender;

  //if sender is a student
  if (isStudent) {
    sender = await auth.findOne({
      email: comment_sender_email_id,
    });
  } else {
    sender = await Users.findOne({
      email: comment_sender_email_id,
    });
  }
  const User = await Comments.findOne({
    comment_reciever_id: comment_reciever_id,
  });

  try {
    var newUser;
    if (!User) {
      newUser = await Comments.create({
        comment_reciever_id: comment_reciever_id,
      });
    }
    const commentField = isStudent
      ? "comment_sender_student"
      : "comment_sender";

    const newUser2 = await Comments.findOneAndUpdate(
      {
        comment_reciever_id: !User
          ? newUser.comment_reciever_id
          : User.comment_reciever_id,
      },
      {
        $push: {
          [commentField]: {
            id: sender._id.toString(),
            comment: comment,
            status: status,
            order: !User
              ? 1
              : User.comment_sender.length +
                User.comment_sender_student.length +
                1,
          },
        },
      }
    );

    return res.send({ message: "Comment added" });
  } catch (err) {}
});

const getComments = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware

  // let comment_receiver_roll_no = req.body.comment_reciever_roll_no;

  const usersId = await Users.findOne({
    email: email,
  });
  const comment_reciever_id = usersId._id.toString();
  // const users = await Comments.aggregate([{
  //   comment_sender: {
  //     $elemMatch: {
  //       id: comment_reciever_id,
  //     },
  //   },
  //   comment_sender_student: {
  //     $elemMatch: {
  //       id: comment_reciever_id,
  //     },
  //   },
  // }]).populate("comment_reciever_id");

  const users = await Comments.find({
    $or: [
      { "comment_sender.id": comment_reciever_id },
      { "comment_sender_student.id": comment_reciever_id },
    ],
  }).populate("comment_reciever_id");

  const allComments = [];

  users.forEach((user) => {
    if (
      user.comment_reciever_id &&
      user.comment_reciever_id.name &&
      (user.comment_sender || user.comment_sender_student)
    ) {
      user.comment_sender.forEach((comment) => {
        if (comment && comment.id === comment_reciever_id) {
          allComments.push({
            comment: comment.comment,
            comment_reciever_name: user.comment_reciever_id.name,
            comment_id: comment._id,
            user_comment_reciever_id: user.comment_reciever_id._id,
            comment_reciever_roll_no: user.comment_reciever_id.roll_no,
            order: comment.order,
            comment_receiver_image: user.comment_reciever_id.profile_img,
          });
        }
      });
      user.comment_sender_student.forEach((comment) => {
        if (comment && comment.id === comment_reciever_id) {
          allComments.push({
            comment: comment.comment,
            comment_reciever_name: user.comment_reciever_id.name,
            comment_id: comment._id,
            user_comment_reciever_id: user.comment_reciever_id._id,
            comment_reciever_roll_no: user.comment_reciever_id.roll_no,
            order: comment.order,
            // who: true,
          });
        }
      });
    }
  });

  if (allComments.length === 0) {
    return res.status(200).json({ message: "No comments found" });
  }

  res.status(200).json({ message: "Comments found", User: allComments });
  // res.json({message: "hello"})
});

const setApprovedComments = asyncHandler(async (req, res) => {
  // const comment_reciever_email_id = req.body.comment_reciever_email_id
  // const comment_reciever_id = req.body.comment_reciever_id
  // const comment_sender_email_id = req.body.comment_sender_email_id

  const email = req.tokenEmail; // Email from middleware

  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comment = req.body.comment;
  const _id = req.body._id;
  // const comment_sender_id = req.body.id

  const usersId = await Users.findOne({
    roll_no: comment_reciever_roll_no,
  });

  const user = await Comments.find({
    comment_reciever_id: usersId._id,
  });

  if (
    !user?.length ||
    !user[0]
    // || !user[0].comment_sender ||
    // !user[0].comment_sender_student
  ) {
    return res.status(404).json({ message: "No user found" });
  }

  if (email !== usersId.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to approve this comment" });
  }

  for (var i = 0; i < user[0].comment_sender.length; i++) {
    if (
      user[0].comment_sender[i] &&
      user[0].comment_sender[i]._id == _id &&
      user[0].comment_sender[i].comment === comment &&
      user[0].comment_sender[i].status == "new"
    ) {
      // user[0].comment_sender[i].status = 'approved';
      user[0].comment_sender[i].status = "approved";
      await user[0].save();
      break;
    }
  }

  for (var i = 0; i < user[0].comment_sender_student.length; i++) {
    if (
      user[0].comment_sender_student[i] &&
      user[0].comment_sender_student[i]._id == _id &&
      user[0].comment_sender_student[i].comment === comment &&
      user[0].comment_sender_student[i].status == "new"
    ) {
      // user[0].comment_sender_student[i].status = 'approved';
      user[0].comment_sender_student[i].status = "approved";
      await user[0].save();
      break;
    }
  }

  // -----------------------------------------------------------------------------
  // const user = await Comments.find({
  //     comment_sender: {
  //         $elemMatch: {
  //             _id: _id,
  //         },
  //     },
  // })

  // if (!user || user.length === 0) {
  //     return res.send({ message: 'No user found' });
  // }

  //

  res.status(200).json({ message: "comment added in approved section", user });
});

const setRejectedComments = asyncHandler(async (req, res) => {
  // const comment_reciever_email_id = req.body.comment_reciever_email_id
  // const comment_reciever_id = req.body.comment_reciever_id
  // const comment_sender_email_id = req.body.comment_sender_email_id

  const email = req.tokenEmail; // Email from middleware

  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comment = req.body.comment;
  const _id = req.body._id;
  // const comment_sender_id = req.body.id
  // console.log("approved comment default", _id);
  // console.log("comment_reciever_roll_no", comment_reciever_roll_no);

  // console.log( comment)
  const usersId = await Users.findOne({
    roll_no: comment_reciever_roll_no,
  });

  const user = await Comments.find({
    comment_reciever_id: usersId._id,
  });

  // console.log("User:", user);
  // console.log("User+++:", user[0].comment_sender);

  if (
    !user?.length ||
    !user[0] ||
    !user[0].comment_sender ||
    !user[0].comment_sender_student
  ) {
    // console.log("it goes inside");
    return res.send({ message: "No user found" });
  }

  if (email !== usersId.email) {
    return res
      .status(403)
      .json({ message: "You are not authorized to reject this comment" });
  }

  for (var i = 0; i < user[0].comment_sender.length; i++) {
    if (
      user[0].comment_sender[i] &&
      user[0].comment_sender[i]._id == _id &&
      user[0].comment_sender[i].comment === comment &&
      user[0].comment_sender[i].status == "new"
    ) {
      // console.log( user[0].comment_sender[i])
      // console.log("Updating status to 'rejected'");
      // user[0].comment_sender[i].status = 'approved';
      user[0].comment_sender[i].status = "rejected";
      await user[0].save();
      break;
    }
  }

  for (var i = 0; i < user[0].comment_sender_student.length; i++) {
    if (
      user[0].comment_sender_student[i] &&
      user[0].comment_sender_student[i]._id == _id &&
      user[0].comment_sender_student[i].comment === comment &&
      user[0].comment_sender_student[i].status == "new"
    ) {
      // console.log( user[0].comment_sender_student[i])
      // console.log("Updating status to 'rejected'");
      // user[0].comment_sender_student[i].status = 'approved';
      user[0].comment_sender_student[i].status = "rejected";
      await user[0].save();
      break;
    }
  }

  // -----------------------------------------------------------------------------
  // const user = await Comments.find({
  //     comment_sender: {
  //         $elemMatch: {
  //             _id: _id,
  //         },
  //     },
  // })

  // console.log("user req comment:", user);

  // if (!user || user.length === 0) {
  //     console.log("No user found");
  //     return res.send({ message: 'No user found' });
  // }

  //

  res.status(200).json({ message: "comment added in rejected section", user });
});

// 6582a3be44e2daae019909a8
// 6582ad281aa809bdc81221e6
// ------------------------------------------------------------------------------------------------
const getRecieversComments = asyncHandler(async (req, res) => {
  try {
    // const comment_reciever_email_id = req.body.comment_reciever_email_id
    // let comment_reciever_id = req.body.comment_reciever_id
    const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
    // console.log("before +++",comment_reciever_id)
    // console.log("before +++", comment_reciever_roll_no);

    // if(comment_reciever_id===undefined){
    const usersId = await Users.findOne({
      roll_no: comment_reciever_roll_no,
    });

    // console.log(usersId)

    const comment_reciever_id = usersId._id.toString();
    //    if (usersId && usersId._id) {
    //     comment_reciever_id = usersId._id.toString();
    //     console.log("after +++",comment_reciever_id)
    //   } else {
    //     // Handle the case when usersId or usersId._id is not available
    //     return res.status(404).json({ success: false, message: 'User not found for the given roll_no' });
    //   }
    // }

    // console.log("the id is++++++++++++++++++++++++",comment_reciever_email_id);/
    // console.log("the id is++++++++++++++++++++++++",comment_reciever_id);

    //Get all usersData from MongoDb
    const users = await Comments.findOne({
      comment_reciever_id: comment_reciever_id,
    })
      .populate({
        path: "comment_sender.id",
        model: "Users",
      })
      .populate({
        path: "comment_sender_student.id",
        model: "Auth",
      })
      .exec();
    // .populate({path:"id"});
    // console.log("user1+++++++++",users.comment_sender[0])
    // console.log("user0+++++++++",users.comment_sender[1])

    //If no usersData
    if (!users) {
      // console.log("reached");
      return res.status(200).json({ message: "No userData found" });
    }
    // console.log("testing")
    // console.log(users.user[0])

    const approvedComments = users.comment_sender
      .filter((sender) => sender.status === "approved")
      .concat(
        users.comment_sender_student.filter(
          (sender) => sender.status === "approved"
        )
      );

    const rejectedComments = users.comment_sender
      .filter((sender) => sender.status === "rejected")
      .concat(
        users.comment_sender_student.filter(
          (sender) => sender.status === "rejected"
        )
      );

    // console.log("Approved Comments:", approvedComments);
    const newComments = users.comment_sender
      .filter((sender) => sender.status === "new")
      .concat(
        users.comment_sender_student.filter((sender) => sender.status === "new")
      );
    // console.log("new Comments:", newComments);

    // console.log("asdas" + newComments);

    // Extract the relevant data and send it to the frontend
    let responseData = approvedComments.map((comment) => ({
      _id: comment._id,
      id: comment.id,
      comment: comment.comment,
      name: comment.id ? comment.id.name : "N/A",
      roll_no: comment.id ? comment.id.roll_no : "N/A",
      email_id: comment.id ? comment.id.email : "N/A",
      academic_program: comment.id ? comment.id.academic_program : "N/A",
      order: comment.order,
      // Add more fields as needed
    })); //object
    // console.log("testingggggg");
    // console.log(newComments[0].id);
    // console.log(newComments[0].id.name);
    responseData = responseData.sort((a, b) => a.order - b.order);

    let responseData2 = newComments.map((comment) => ({
      _id: comment._id,
      id: comment.id,
      comment: comment.comment,
      name: comment.id ? comment.id.name : "N/A",
      roll_no: comment.id ? comment.id.roll_no : "N/A",
      email_id: comment.id ? comment.id.email : "N/A",
      academic_program: comment.id ? comment.id.academic_program : "N/A",
      order: comment.order,
      // Add more fields as needed
    }));
    responseData2 = responseData2.sort((a, b) => a.order - b.order);

    let responseData3 = rejectedComments.map((comment) => ({
      _id: comment._id,
      id: comment.id,
      comment: comment.comment,
      name: comment.id ? comment.id.name : "N/A",
      roll_no: comment.id ? comment.id.roll_no : "N/A",
      email_id: comment.id ? comment.id.email : "N/A",
      academic_program: comment.id ? comment.id.academic_program : "N/A",
      order: comment.order,
      // Add more fields as needed
    }));
    res.status(200).json({
      approvedComments: responseData,
      user2: responseData2,
      rejectedComments: responseData3,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// const getRecieversComments = asyncHandler(async (req, res) => {
//     try{
//         const comment_
//     }
//     catch{

//     }

// })

const getRecieverComments2 = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware

  try {
    const comment_reciever_roll_no = req.body.comment_reciever_roll_number;
    const isStudent = req.body.isStudent;

    console.log("users+++++/8///:", comment_reciever_roll_no);

    const usersId = await Users.findOne({
      roll_no: comment_reciever_roll_no,
    });
    if (usersId && usersId._id) {
      comment_reciever_id = usersId._id.toString();
    } else {
      // Handle the case when usersId or usersId._id is not available
      return res.status(404).json({
        success: false,
        message: "User not found for the given roll_no",
      });
    }
    // Get all usersData from MongoDb
    const users = await Comments.findOne({
      comment_reciever_id: comment_reciever_id,
    })
      .populate({
        path: "comment_sender.id",
        model: "Users",
      })
      .populate({
        path: "comment_sender_student.id",
        model: "Auth",
      })
      .exec();

    // console.log("users:", users);

    const user = {
      name: usersId.name,
      roll_no: usersId.roll_no,
      profImage: usersId.profile_img,
      email: usersId.email,
      about: usersId.about,
    };
    // console.log(user);

    //If no usersData
    if (!users) {
      // console.log("reached");
      return res.status(200).json({ message: "No userData found", user: user });
    }

    const approvedComments = users.comment_sender
      .filter((sender) => sender.status === "approved")
      .concat(
        users.comment_sender_student.filter(
          (sender) => sender.status === "approved"
        )
      );

    // Extract the relevant data and send it to the frontend
    let responseData = approvedComments.map((comment) => ({
      _id: comment._id,
      id: comment.id,
      comment: comment.comment,
      name: comment.id ? comment.id.name : "N/A",
      roll_no: comment.id ? comment.roll_no : "N/A",
      profImage: comment.id ? comment.profile_img : "N/A",
      email_id: comment.id ? comment.email_id : "N/A",
      order: comment.order,
      // academic_program: comment.id ? comment.id.academic_program : 'N/A',
      // Add more fields as needed
    })); //object
    responseData = responseData.sort((a, b) => a.order - b.order);

    // console.log(responseData);
    res.status(200).json({ approvedComments: responseData, user: user });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const updateCommentOrder = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware

  try {
    const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
    const usersId = await Users.findOne({
      roll_no: comment_reciever_roll_no,
    });
    if (!usersId) {
      return res.status(404).json({ message: "User not found" });
    }
    if (email !== usersId.email) {
      return res.status(403).json({
        message: "You are not authorized to update this comment order",
      });
    }

    const comment_reciever_id = usersId._id;

    const { updatedOrder } = req.body;
    // console.log(
    //   "Update Order just after sending data to backend",
    //   updatedOrder
    // );

    await Promise.all(
      updatedOrder.map(async (commentData, index) => {
        const { _id, order } = commentData;

        const commentField = !commentData.roll_no
          ? "comment_sender_student._id"
          : "comment_sender._id";

        const result = await Comments.updateOne(
          {
            comment_reciever_id,
            [commentField]: commentData._id,
          },
          !commentData.roll_no
            ? { $set: { "comment_sender_student.$.order": index } }
            : { $set: { "comment_sender.$.order": index } }
          // { $set: { "comment_sender.$.order": index }}
        );
      })
    );

    const updateQuery = {
      $push: {
        comment_sender: {
          $each: [],
          $sort: { order: 1 },
        },
        comment_sender_student: {
          $each: [],
          $sort: { order: 1 },
        },
      },
    };

    // await Comments.updateOne({ comment_reciever_email_id }, updateQuery);
    await Comments.updateOne({ comment_reciever_id }, updateQuery);

    // let updatedResult = await Comments.findOne({ comment_reciever_email_id });
    let updatedResult = await Comments.findOne({ comment_reciever_id });
    // console.log("After sorting updatedorder is", updatedResult);

    let updatedArray = [];

    updatedResult.comment_sender.forEach((sender) => {
      updatedArray.push(sender);
    });
    updatedResult.comment_sender_student.forEach((sender) => {
      updatedArray.push(sender);
    });

    updatedArray = updatedArray.filter(
      (sender) => sender.status === "approved"
    );

    updatedArray = updatedArray.sort((a, b) => a.order - b.order);

    // console.log(updatedResult);

    return res.status(200).json({
      message: "Updated comment order in MongoDB successfully",
      comments: updatedArray,
    });
  } catch (error) {
    console.error("Error updating comment order:", error);

    return res.status(500).json({ error: "Internal server error" });
  }
});

const removeCommentFromMyComments = asyncHandler(async (req, res) => {
  const tokenemail = req.tokenEmail; // Email from middleware

  const email = req.body.email;
  const comment = req.body.comment;

  if (!email || !comment) {
    return res.status(400).json({ message: "Email and comment are required" });
  }

  if (email !== tokenemail) {
    return res.status(403).json({ message: "You are not authorized to remove this comment" });
  }

  const users = await Comments.find({
    comment_sender: {
      $elemMatch: {
        email_id: email,
        comment: comment,
      },
    },
  });

  await Promise.all(
    users.map(async (user) => {
      const commentIndex = user.comment_sender.findIndex(
        (sender) => sender.email_id === email && sender.comment === comment
      );
      if (commentIndex !== -1) {
        user.comment_sender.pull(user.comment_sender[commentIndex]);
        await user.save();
      }
    })
  );

  res.status(200).json({ message: "Comment removed successfully" });
});

const removeCommentFromApprovedComments = asyncHandler(async (req, res) => {
  // const comment_reciever_email_id = req.body.comment_reciever_email_id
  // const comment = req.body.comment
  // const email = req.body.email
  const email = req.tokenEmail; // Email from middleware

  const order = req.body.order;
  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comt = req.body.comment;

  let change = 0;

  const usersId = await Users.findOne({
    roll_no: comment_reciever_roll_no,
  });

  if (!usersId) {
    return res.status(404).json({ message: "User not found" });
  }

  if (email !== usersId.email) {
    return res.status(403).json({
      message: "You are not authorized to remove this comment",
    });
  }

  const comment_reciever_id = usersId._id;

  //Get all usersData from MongoDb
  const user = await Comments.findOne({
    comment_reciever_id: comment_reciever_id,
  });

  // console.log(typeof(user));
  let stud = false;
  if (user) {
    // Modify comment_sender array
    user.comment_sender.forEach((comment) => {
      // console.log(comment.order == comment_index && comment.status == "approved");
      if (
        comt === comment.comment &&
        comment.order == order &&
        comment.status == "approved"
      ) {
        stud = true;
        comment.status = "new";
        change++;
      }
      if (stud && comment.order > order) {
        comment.order -= 1; // Reduce order by 1
      }
    });

    stud = false;

    // Modify comment_sender_student array
    user.comment_sender_student.forEach((comment) => {
      // console.log(comment.order == comment_index && comment.status == "approved");
      if (
        comt === comment.comment &&
        comment.order == order &&
        comment.status == "approved"
      ) {
        stud = true;
        comment.status = "new";
        change++;
        // console.log(comment.status);
      }
      if (comment.order > order) {
        comment.order -= 1; // Reduce order by 1
      }
    });

    // Save the document
    await user.save();
  }
  //If no usersData
  // if (users.length === 0) {
  //     return res.send({ message: 'No userData found' })
  // }
  // let commentRemoved = false;
  // await Promise.all(users.map(async (user) => {
  //     const commentIndex = user.comment_sender.findIndex((sender) => sender.email_id === email && sender.comment === comment && sender.status === "approved");
  //     if (commentIndex !== -1) {
  //         user.comment_sender[commentIndex].status = "new"
  //         await user.save();
  //         commentRemoved = true;
  //     }
  // }));

  // if (!user?.length) {
  //   return res.send({ message: "No user found" });
  // }

  // for (var i = 0; i <= user[0].comment_sender.length; i++) {
  //   if (
  //     user[0].comment_sender[i]._id == _id &&
  //     user[0].comment_sender[i].comment === comment
  //   ) {
  //     user[0].comment_sender[i].status = "new";

  //     await user[0].save();
  //     break;
  //   }
  // }
  console.log(change);
  if (change > 0) {
    console.log(true);
    res.status(200).json({ message: "comment added in new section", worked: true, user });
  }
  console.log(false);
  res.status(200).json({ message: "comment added in new section", worked: false, user });
});

// let sharedEditComment;

const editComment = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware

  const EditComment = req.body.comment;
  // console.log("comment after edit", EditComment);
  const comment_reciever_id_edit = req.body.comment_reciever_id_edit;
  // console.log("comment after edit", comment_reciever_id_edit);
  const comment_id_edit = req.body.comment_id_edit;
  // console.log("comment_reciever_id_edit", comment_reciever_id_edit);
  // console.log("comment_id_edit", comment_id_edit);

  try {
    const result = await Comments.updateOne(
      { "comment_sender._id": comment_id_edit },
      {
        $set: {
          "comment_sender.$.comment": EditComment,
          "comment_sender.$.status": "new",
        },
      }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Comment not found or not modified" });
    }

    // console.log("Edited comment successfully");
    res.status(200).json({ message: "Comment edited successfully" });
  } catch (error) {
    // console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const getEditCommentsInfo = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware

  try {
    const comment_reciever_id_edit = req.body.comment_reciever_id_edit;
    const comment_id_edit = req.body.comment_id_edit;
    // console.log("comment_reciever_id_edit", comment_reciever_id_edit);
    // console.log("comment_id_edit",comment_id_edit)

    const user = await Users.findOne({ roll_no: comment_reciever_id_edit });
    const comment = await Comments.findOne(
      { "comment_sender._id": comment_id_edit },
      { "comment_sender.$": 1 } // Projection to return only the matching array element
    );

    // console.log("user is", user);
    // console.log("comment is", comment);
    // console.log("comment after edit2222",sharedEditComment)

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({ user: user, comment: comment });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const ungradmycomment = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware

  const comment_reciever_email = email;

  const usersEmail = await auth.findOne({
    email: comment_reciever_email,
  });

  // let comment_reciever_id = req.body.comment_reciever_id;
  let comment_reciever_id = usersEmail._id.toString();
  // console.log("nongrd",comment_reciever_id)

  const users = await Comments.find({
    comment_sender_student: {
      $elemMatch: {
        id: comment_reciever_id,
      },
    },
  }).populate("comment_reciever_id");

  // console.log("++++++",users)

  const allComments = [];

  users.forEach((user) => {
    if (
      user.comment_reciever_id &&
      user.comment_reciever_id.name &&
      user.comment_sender_student
    ) {
      user.comment_sender_student.forEach((comment) => {
        if (comment && comment.id === comment_reciever_id) {
          allComments.push({
            comment: comment.comment,
            comment_reciever_name: user.comment_reciever_id.name,
            comment_id: comment._id,
            user_comment_reciever_id: user.comment_reciever_id._id,
            comment_reciever_roll_no: user.comment_reciever_id.roll_no,
          });
        }
      });
    }
  });

  if (allComments.length === 0) {
    return res.status(200).json({ message: "No comments found" });
  }

  // console.log("++++++++++++alllllllllllll",allComments)

  res.status(200).json({ message: "Comments found", User: allComments });
});

// const protectionProfilePage= asyncHandler(async (req, res) => {
// // app.get('/profile/:roll', requireAuth, (req, res) => {

// NOT WORKING, UNDEEFINED EMAIL.

//   const { roll } = req.params;
//   console.log("roll is++++ ",roll)

//   const User = req.session.user;

// console.log("resultAuth",User)

//   const userAuthUsersTable = await Users.findOne({
//     email: User.email,
//   });

// console.log("+++++++u+++",userAuthUsersTable.roll)
//   if (userAuthUsersTable.roll !== roll) {
//       // return res.status(403).json({ message: 'Forbidden' ,roll: userAuthUsersTable.roll, name:userAuthUsersTable.name });
//       return res.status(403).json({ message: 'Forbidden' ,userAuthUsersTable: userAuthUsersTable });
//   }
//   // Authorized user, return profile data
//   res.json({ message:'Allowed', userAuthUsersTable: userAuthUsersTable });
// });

// const protectionEditComment= asyncHandler(async (req, res) => {
//   const comment_id_edit=req.body.comment_id_edit
//   console.log("----",comment_id_edit)

// //   const users = await Comments.find({
// //     comment_sender_student: {
// //         $elemMatch: {
// //             _id: comment_id_edit,
// //         },
// //     },
// // })
// //     .populate('id');

// const users = await Comments.findOne(
//   { "comment_sender._id": comment_id_edit },
//   { "comment_sender.$": 1 }
// ).populate({
//   path: 'comment_sender',
//   populate: {
//     path: 'id',
//     model: 'Users',

//   }
// });

// // console.log("ID:", users.comment_sender[0].id.roll_no);
// if(users==null){

// const students = await Comments.findOne(
//   { "comment_sender_student._id": comment_id_edit },
//   { "comment_sender_student.$": 1 } // Projection to return only the matching array element
// ).populate({
//   path: 'comment_sender_student',
//   populate: {
//     path: 'id',
//     model: 'Auth',

//   }
// });

// if(students==null){
//   res.json({message:'No userData found' });
// }

//     console.log("students++",students.comment_sender_student[0].id)
//     res.json({message:'User Data found',  students: students });

// }
// res.json({ message:'User Data found', users: users });

// });

const protectionEditComment = asyncHandler(async (req, res) => {
  const email = req.tokenEmail; // Email from middleware
  
  const comment_id_edit = req.body.comment_id_edit;
  const isStudent = req.body.isStudent;
  // console.log("----",comment_id_edit)
  // console.log("----",isStudent)

  //   const users = await Comments.find({
  //     comment_sender_student: {
  //         $elemMatch: {
  //             _id: comment_id_edit,
  //         },
  //     },
  // })
  //     .populate('id');
  if (!isStudent) {
    console.log("i m user graduating");
    const users = await Comments.findOne(
      { "comment_sender._id": comment_id_edit },
      { "comment_sender.$": 1 }
    ).populate({
      path: "comment_sender",
      populate: {
        path: "id",
        model: "Users",
      },
    });
    // console.log("users is +++",users)
    if (users == null) {
      res.status(404).json({ message: "No userData found" });
    }

    res.json({ message: "User Data found", users: users });
  } else {
    const students = await Comments.findOne(
      { "comment_sender_student._id": comment_id_edit },
      { "comment_sender_student.$": 1 } // Projection to return only the matching array element
    ).populate({
      path: "comment_sender_student",
      populate: {
        path: "id",
        model: "Auth",
      },
    });

    if (students == null) {
      res.status(404).json({ message: "No userData found" });
    }

    // console.log("students++",students.comment_sender_student[0].id)
    res.status(200).json({ message: "User Data found", students: students });
  }
});

module.exports = {
  comments,
  getComments,
  setApprovedComments,
  setRejectedComments,
  getRecieversComments,
  removeCommentFromMyComments,
  removeCommentFromApprovedComments,
  updateCommentOrder,
  getEditCommentsInfo,
  editComment,
  getRecieverComments2,
  ungradmycomment,
  // protectionProfilePage
  protectionEditComment,
};
