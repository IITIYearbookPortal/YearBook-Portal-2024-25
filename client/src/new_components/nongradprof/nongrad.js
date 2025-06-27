import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../helpers/Context";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { forbiddenError, unauthorizedError } from "../../utils/authErrors";

const Nongrad = () => {
  const { name, email } = useParams();
  const {
    user,
    setUser,
    loading,
    setLoading,
    profile,
    loggedin,
    setLoggedin,
    isStudent,
  } = useContext(LoginContext);

  const [message2, setMessage2] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const token = jwtDecode(window.sessionStorage.getItem("token"));

  useEffect(() => {
    if (!loading && !loggedin) {
      window.location.href = "/login";
    }

    if (!loading && !isStudent) {
      window.location.href = "/error";
    }

    if (!loading && (email !== token.email || name !== token.name)) {
      window.location.href = "/error";
    }
  });

  useEffect(() => {
    if (email) {
      axios
        .post(
          process.env.REACT_APP_API_URL + "/ungradmycomment",
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 404) {
            window.location.href = "/error";
          } else if (res.status === 401) {
            forbiddenError(setLoggedin, setUser);
          } else if (res.status === 403) {
            unauthorizedError(setLoggedin, setUser);
          }
          if (res.data.message === "No users found") {
            setMessage2(res.data.message);
            setComments([]);
          } else {
            setComments(res.data.User);
          }
        })
        .catch((err) => {});
    }
  }, []);

  const HandlEdit = (val) => {
    navigate(`/comment/edit/${val.comment_reciever_roll_no}/${val.comment_id}`);
    // navigate(`/comment/edit/${val.user_comment_reciever_id}-${val.comment_id}-${val.comment}`);
  };
  return (
    <div className="w-screen h-screen flex flex-col gap-y-4 justify-start items-center text-white bg-[#1F2937]">
      <div className="flex text-center rounded-2xl border-4 justify center gap-x-4 py-5 lg:gap-x-0 text-[#6ccf59] lg:flex-col lg:relative  lg:top-[50px] border-black w-80 bg-[#111827] border-black ">
        <div className="name3 ">
          <h3>Name: {token.name}</h3>
        </div>
        <div className="name3 mt-4">
          <h3>Email: {token.email}</h3>
        </div>
      </div>
      <h1 className="text-center p-1 mt-10 font-extrabold text-4xl">
        My Comments
      </h1>
      <p className="text-lg text-center">
        Start Commenting on other people to view your comments here.{" "}
        <a href="/userlist" className="hover:underline">
          Comment Now
        </a>
      </p>

      <div
        id="commentsscroll"
        className="flex-row flex gap-x-4 flex-wrap w-full justify-center"
      >
        {comments && comments.length !== 0 && (
          <>
            {comments.map((val) => (
              <div id="comment" className="w-96 bg-[#111827] border-none">
                <p id="commentp">{val.comment}</p>
                <button
                  id="ebtn"
                  className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-1 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                  onClick={() => {
                    HandlEdit(val);
                  }}
                >
                  Edit Comment
                </button>
                <p id="commentby">-{val.comment_reciever_name}</p>
              </div>
            ))}
          </>
        )}
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
