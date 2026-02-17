const asyncHandler = require("express-async-handler");
require("dotenv").config();
const mongoose = require("mongoose");
const Users = require("../models/userModel");
const Comments = require("../models/comments");
const auth = require("../models/authModel");

//Adding the comment
const comments = asyncHandler(async (req, res) => {
  const comment_sender_email_id = req.body.comment_sender_email;
  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comment = req.body.comment;
  const status = req.body.status;
  const isStudent = req.body.isStudent;

  if(comment === ""){
    return res.status(406).send({ statusmessage: "Comment cannot be empty" });
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
  let comment_receiver_roll_no = req.body.comment_reciever_roll_no;

  const usersId = await Users.findOne({
    roll_no: comment_receiver_roll_no,
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
    return res.send({ message: "No comments found" });
  }

  res.json({ message: "Comments found", User: allComments });
  // res.json({message: "hello"})
});

const setApprovedComments = asyncHandler(async (req, res) => {
  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comment = req.body.comment;
  const _id = req.body._id;
  const usersId = await Users.findOne({
    roll_no: comment_reciever_roll_no,
  });

  const user = await Comments.find({
    comment_reciever_id: usersId._id,
  });

  if (
    !user?.length ||
    !user[0]
  ) {
    return res.send({ message: "No user found" });
  }

  for (var i = 0; i < user[0].comment_sender.length; i++) {
    if (
      user[0].comment_sender[i] &&
      user[0].comment_sender[i]._id == _id &&
      user[0].comment_sender[i].comment === comment &&
      user[0].comment_sender[i].status == "new"
    ) {
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
  res.send({ message: "comment added in approved section", user });
});

const setRejectedComments = asyncHandler(async (req, res) => {
  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comment = req.body.comment;
  const _id = req.body._id;
  const usersId = await Users.findOne({
    roll_no: comment_reciever_roll_no,
  });

  const user = await Comments.find({
    comment_reciever_id: usersId._id,
  });
  if (
    !user?.length ||
    !user[0] ||
    !user[0].comment_sender ||
    !user[0].comment_sender_student
  ) {
    return res.send({ message: "No user found" });
  }

  for (var i = 0; i < user[0].comment_sender.length; i++) {
    if (
      user[0].comment_sender[i] &&
      user[0].comment_sender[i]._id == _id &&
      user[0].comment_sender[i].comment === comment &&
      user[0].comment_sender[i].status == "new"
    ) {
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
      user[0].comment_sender_student[i].status = "rejected";
      await user[0].save();
      break;
    }
  }
  res.send({ message: "comment added in rejected section", user });
});

const getRecieversComments = asyncHandler(async (req, res) => {
  try {
    const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
    const usersId = await Users.findOne({
      roll_no: comment_reciever_roll_no,
    });
    const comment_reciever_id = usersId._id.toString();
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
    if (!users) {
      return res.send({ message: "No userData found" });
    }

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

    const newComments = users.comment_sender
      .filter((sender) => sender.status === "new")
      .concat(
        users.comment_sender_student.filter((sender) => sender.status === "new")
      );
    let responseData = approvedComments.map((comment) => ({
      _id: comment._id,
      id: comment.id,
      comment: comment.comment,
      name: comment.id ? comment.id.name : "N/A",
      roll_no: comment.id ? comment.id.roll_no : "N/A",
      email_id: comment.id ? comment.id.email : "N/A",
      academic_program: comment.id ? comment.id.academic_program : "N/A",
      order: comment.order,
    }));
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
    res.json({
      approvedComments: responseData,
      user2: responseData2,
      rejectedComments: responseData3,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const getRecieverComments2 = asyncHandler(async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "User not found for the given roll_no",
      });
    }
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

    if (!users) {
      return res.send({ message: "No userData found", user: user });
    }

    const approvedComments = users.comment_sender
      .filter((sender) => sender.status === "approved")
      .concat(
        users.comment_sender_student.filter(
          (sender) => sender.status === "approved"
        )
      );

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
    res.json({ approvedComments: responseData, user: user });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const updateCommentOrder = asyncHandler(async (req, res) => {
  try {
    const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
    const usersId = await Users.findOne({
      roll_no: comment_reciever_roll_no,
    });

    const comment_reciever_id = usersId._id;

    const { updatedOrder } = req.body;

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

    await Comments.updateOne({ comment_reciever_id }, updateQuery);

    let updatedResult = await Comments.findOne({ comment_reciever_id });

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
  const email = req.body.email;
  const comment = req.body.comment;

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

  res.send({ message: "Comment removed successfully" });
});

const removeCommentFromApprovedComments = asyncHandler(async (req, res) => {
  const order = req.body.order;
  const comment_reciever_roll_no = req.body.comment_reciever_roll_no;
  const comt = req.body.comment;

  let change = 0;

  const usersId = await Users.findOne({
    roll_no: comment_reciever_roll_no,
  });

  const comment_reciever_id = usersId._id;

  const user = await Comments.findOne({
    comment_reciever_id: comment_reciever_id,
  });

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
    if (change > 0) {
    console.log(true);
    res.send({ message: "comment added in new section", worked: true, user });
  }
  console.log(false);
  res.send({ message: "comment added in new section", worked: false, user });
});

const editComment = asyncHandler(async (req, res) => {
  try {
    const { comment, comment_id_edit, comment_reciever_id_edit, isStudent } = req.body;

    if (!comment?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (!comment_id_edit || !comment_reciever_id_edit) {
      return res.status(400).json({ message: "Missing comment or receiver ID" });
    }

    const receiver = await Users.findOne({ roll_no: comment_reciever_id_edit });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let updateResult;

    if (isStudent === true || isStudent === "true") {
      // Current student
      updateResult = await Comments.updateOne(
        {
          comment_reciever_id: receiver._id,
          "comment_sender_student._id": comment_id_edit,
        },
        {
          $set: {
            "comment_sender_student.$.comment": comment,
            "comment_sender_student.$.status": "new", // reset to pending
          },
        }
      );
    } else {
      // Graduating / alumni
      updateResult = await Comments.updateOne(
        {
          comment_reciever_id: receiver._id,
          "comment_sender._id": comment_id_edit,
        },
        {
          $set: {
            "comment_sender.$.comment": comment,
            "comment_sender.$.status": "new",
          },
        }
      );
    }

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (updateResult.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes needed (same content)" });
    }

    res.status(200).json({ message: "Comment edited successfully" });
  } catch (error) {
    console.error("editComment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const getEditCommentsInfo = asyncHandler(async (req, res) => {
  try {
    const { comment_reciever_id_edit, comment_id_edit, isStudent } = req.body;

    if (!comment_reciever_id_edit || !comment_id_edit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find receiver (always from Users model - roll_no based)
    const receiver = await Users.findOne({ roll_no: comment_reciever_id_edit });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let commentData = null;
    let commentArrayField = null;

    if (isStudent === true || isStudent === "true") {
      // Current student → look in comment_sender_student
      commentData = await Comments.findOne(
        {
          comment_reciever_id: receiver._id,
          "comment_sender_student._id": comment_id_edit,
        },
        { "comment_sender_student.$": 1 }
      ).populate({
        path: "comment_sender_student.id",
        model: "Auth",
        select: "name email", // minimal fields needed
      });

      commentArrayField = "comment_sender_student";
    } else {
      // Graduating/alumni → look in comment_sender
      commentData = await Comments.findOne(
        {
          comment_reciever_id: receiver._id,
          "comment_sender._id": comment_id_edit,
        },
        { "comment_sender.$": 1 }
      ).populate({
        path: "comment_sender.id",
        model: "Users",
        select: "name roll_no email profile_img academic_program department",
      });

      commentArrayField = "comment_sender";
    }

    if (!commentData || !commentData[commentArrayField]?.length) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const commentObj = commentData[commentArrayField][0];
    const sender = commentObj.id || {};

    res.json({
      user: {
        name: receiver.name,
        roll_no: receiver.roll_no,
        profile_img: receiver.profile_img || "",
        academic_program: receiver.academic_program || "",
        department: receiver.department || "",
        about: receiver.about || "",
      },
      comment: {
        _id: commentObj._id,
        comment: commentObj.comment,
        status: commentObj.status,
        order: commentObj.order,
        senderName: sender.name || "Unknown",
        senderEmail: sender.email || "",
      },
    });
  } catch (error) {
    console.error("getEditCommentsInfo error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const ungradmycomment = asyncHandler(async (req, res) => {
  const comment_reciever_email = req.body.comment_reciever_email;

  const usersEmail = await auth.findOne({
    email: comment_reciever_email,
  });

  let comment_reciever_id = usersEmail._id.toString();

  const users = await Comments.find({
    comment_sender_student: {
      $elemMatch: {
        id: comment_reciever_id,
      },
    },
  }).populate("comment_reciever_id");

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
    return res.send({ message: "No comments found" });
  }
  res.json({ message: "Comments found", User: allComments });
});

const protectionEditComment = asyncHandler(async (req, res) => {
  try {
    const { comment_id_edit } = req.body;

    if (!comment_id_edit) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 1. Try graduating/alumni array
    const alumniComment = await Comments.findOne(
      { "comment_sender._id": comment_id_edit },
      { "comment_sender.$": 1 }
    ).populate({
      path: "comment_sender.id",
      model: "Users",
      select: "email name roll_no",
    });

    if (alumniComment && alumniComment.comment_sender?.length > 0) {
      const senderEmail = alumniComment.comment_sender[0].id?.email;

      if (senderEmail === userEmail) {
        return res.json({
          message: "Authorized",
          data: alumniComment,
          type: "alumni",
        });
      } else {
        return res.status(403).json({ message: "You are not the author of this comment" });
      }
    }

    // 2. Try current students array
    const studentComment = await Comments.findOne(
      { "comment_sender_student._id": comment_id_edit },
      { "comment_sender_student.$": 1 }
    ).populate({
      path: "comment_sender_student.id",
      model: "Auth",
      select: "email name",
    });

    if (studentComment && studentComment.comment_sender_student?.length > 0) {
      const senderEmail = studentComment.comment_sender_student[0].id?.email;

      if (senderEmail === userEmail) {
        return res.json({
          message: "Authorized",
          data: studentComment,
          type: "student",
        });
      } else {
        return res.status(403).json({ message: "You are not the author of this comment" });
      }
    }

    return res.status(404).json({ message: "Comment not found" });
  } catch (error) {
    console.error("protectionEditComment error:", error);
    res.status(500).json({ message: "Server error" });
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
  protectionEditComment,
};