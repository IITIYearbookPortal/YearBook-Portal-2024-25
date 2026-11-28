import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../helpers/Context";
import { useNavigate, useParams } from "react-router-dom";

const Nongrad = () => {
  const { name, email } = useParams();
  const { user, loading, setLoading, profile, loggedin, isStudent } =
    useContext(LoginContext);

  const [message2, setMessage2] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const token = user;

  useEffect(() => {
    if (email) {
      axios
        .post(process.env.REACT_APP_API_URL + "/ungradmycomment", {
          comment_reciever_email: email,
        })
        .then((res) => {
          if (res.data.message === "No users found") {
            setMessage2(res.data.message);
            setComments([]);
          } else {
            setComments(res.data.User || []);
          }
        })
        .catch(() => {});
    }
  }, [email]);

  const HandlEdit = (val) => {
    navigate(`/comment/edit/${val.comment_reciever_roll_no}/${val.comment_id}`);
  };
  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12 flex flex-col items-center text-white bg-pagebg">
      <div className="w-full max-w-md bg-[#111827] border border-gray-700/80 rounded-2xl px-6 py-5 shadow-lg text-center space-y-2 text-[#6ccf59]">
        <h3 className="text-base sm:text-lg font-semibold break-words">
          Name: {token.name}
        </h3>
        <h3 className="text-sm sm:text-base font-medium break-all text-[#6ccf59]/90">
          Email: {token.email}
        </h3>
      </div>

      <h1 className="text-center mt-8 sm:mt-10 font-extrabold text-3xl sm:text-4xl tracking-tight">
        My Comments
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-center text-gray-300 mt-2 mb-8 max-w-xl px-2">
        Start commenting on graduating seniors to view your comments here.{" "}
        <a
          href="/userlist"
          className="text-[#6ccf59] font-semibold hover:underline"
        >
          Comment Now
        </a>
      </p>

      <div
        id="commentsscroll"
        className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {comments &&
          comments.length > 0 &&
          comments.map((val, idx) => (
            <div
              key={val.comment_id || idx}
              id="comment"
              className="w-full bg-[#111827] border border-gray-700/70 rounded-2xl p-5 shadow-md flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p
                id="commentp"
                className="text-gray-200 text-sm sm:text-base leading-relaxed break-words"
              >
                {val.comment}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-800">
                <button
                  id="ebtn"
                  className="w-full sm:w-auto rounded-xl border-2 border-dashed border-black bg-white px-4 py-2 text-xs sm:text-sm font-semibold uppercase text-black transition-all duration-200 hover:-translate-y-0.5 hover:rounded-lg hover:shadow-[3px_3px_0px_black] active:translate-y-0 active:shadow-none whitespace-nowrap"
                  onClick={() => {
                    HandlEdit(val);
                  }}
                >
                  Edit Comment
                </button>
                <p
                  id="commentby"
                  className="text-xs sm:text-sm text-gray-400 font-medium break-words"
                >
                  — {val.comment_reciever_name}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Nongrad;

// const ungradmycomment = asyncHandler(async (req, res) => {
//   const  comment_reciever_email=req.body.comment_reciever_email

//   const usersEmail = await Users.findOne({
//     email: comment_reciever_email,
//   });

//   // let comment_reciever_id = req.body.comment_reciever_id;
//   let comment_reciever_id = usersEmail._id.toString();

//   const users = await Comments.find({
//       comment_sender: {
//           $elemMatch: {
//               id: comment_reciever_id,
//           },
//       },
//   })
//       .populate('comment_reciever_id');

//   const allComments = [];

//   users.forEach(user => {
//       if (user.comment_reciever_id && user.comment_reciever_id.name && user.comment_sender) {
//           user.comment_sender.forEach(comment => {
//               if (comment && comment.id === comment_reciever_id) {
//                   allComments.push({
//                       comment: comment.comment,
//                       comment_reciever_name: user.comment_reciever_id.name,
//                       comment_id: comment._id,
//                       user_comment_reciever_id: user.comment_reciever_id._id,
//                   });
//               }
//           });
//       }
//   });

//   if (allComments.length === 0) {
//       return res.send({ message: 'No comments found' });
//   }

//   res.json({ message: 'Comments found', User: allComments });
// });
