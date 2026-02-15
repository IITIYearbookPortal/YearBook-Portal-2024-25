import "./EditAComment.css";
// import { useState } from "react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../helpers/Context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import alumniData from "../Navbar/akumniData.json";
import { useParams } from "react-router-dom";

export function Editacomment({ isDarkMode, setIsDarkMode }) {
  const { profile, loggedin, loading, isStudent } = useContext(LoginContext);

  const { userId, commentId } = useParams();

  useEffect(() => {
    if (!loading && !loggedin) {
      window.location.href = "/login";
    }
  });

  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [len, setCommentlen] = useState(0);
  const [comment, setComment] = useState("");

  const handleInputChange = (event) => {
    let inputstr = event.target.value;
    setCommentlen(inputstr.length);
    setComment(inputstr);
  };

  const comment_reciever_id_edit = userId;
  const comment_id_edit = commentId;

  const [editComments, setEditComments] = useState();
  const [editProtection, setEditProtection] = useState();
  const [editCommentsUser, setEditCommentsUser] = useState(null);

  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   return storedThemeMode === "dark";
  // });

  // Protection Edit Comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (comment_reciever_id_edit && comment_id_edit && profile) {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/protectionEditComment",
            {
              // comment_reciever_id_edit: comment_reciever_id_edit,
              comment_id_edit: comment_id_edit,
              isStudent: isStudent,
            }
          );

          const data = response.data;

          if (data.message === "No userData found") {
            // setMessage2(data.message);
            // setEditComments('');
            // setEditCommentsUser(null);
            // window.location.href = '/error'
          } else {
            // setMessage2(data.message);
            // // setEditCommentsUser(data.user);
            // if(!isStudent){
            //   // if(profile.roll_no!==data.users.comment_sender[0].id.roll_no){
            //   //       window.location.href = '/error'
            //   //     }

            // }
            // else{
            //   if(profile.email!==data.students.comment_sender_student[0].id.email){
            //     window.location.href = '/error'
            //   }
            // }
            setEditProtection(data);
          }
        }
      } catch (err) {}
    };

    fetchData();
  }, [comment_reciever_id_edit, comment_id_edit, profile]);

  useEffect(() => {
    if (editProtection) {
      // Check if editProtection data is available
      if (isStudent) {
        if (
          editProtection.students?.comment_sender_student?.[0]?.id?.email !==
          profile.email
        ) {
          window.location.href = "/error";
        } else {
        }
      } else {
        if (
          editProtection.users?.comment_sender?.[0]?.id?.roll_no !==
          profile.roll_no
        ) {
          window.location.href = "/error";
        } else {
        }
      }
    }
  }, [editProtection, isStudent, profile]);

  // Getting Receiver's Edit Comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (comment_reciever_id_edit && comment_id_edit) {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/getEditCommentsInfo",
            {
              comment_reciever_id_edit: comment_reciever_id_edit,
              comment_id_edit: comment_id_edit,
            }
          );

          const data = response.data;

          if (data.message === "No userData found") {
            setMessage2(data.message);
            setEditComments("");
            setEditCommentsUser(null);
          } else {
            setEditComments(data.comment.comment_sender[0].comment);
            setMessage2(data.message);
            setEditCommentsUser(data.user);
          }
        }
      } catch (err) {}
    };

    fetchData();
  }, [comment_reciever_id_edit, comment_id_edit]);

  const handleSubmitedit = async (e) => {
    e.preventDefault();

    if (editComments === "" || editComments === undefined) {
      toast("Comment cannot be empty!", {
        theme: "dark",
        autoClose: 3000,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to edit this comment?"
      );

      if (confirmed) {
        try {
          const res = await axios.post(
            process.env.REACT_APP_API_URL + "/editComment",
            {
              comment: editComments,
              comment_reciever_id_edit: comment_reciever_id_edit,
              comment_id_edit: comment_id_edit,
            }
          );

          toast("Comment Edited Successfully!", {
            theme: "dark",
            autoClose: 1500,
          });
          const timetonavigate = setTimeout(() => {
            navigate(`/profile/${profile.roll_no}/${profile.name}`);
          }, 2000); // delay execution by 2 second

          return () => clearTimeout(timetonavigate);
        } catch (err) {}
      }
    }
  };

  const comment_reciever_id = userId;
  const [approvedComments, setApprovedComments] = useState([]);
  const navigate = useNavigate();

  // Getting Reciever's Comments
  useEffect(() => {
    if (comment_reciever_id_edit) {
      axios
        .post(process.env.REACT_APP_API_URL + "/getRecieversComments2", {
          comment_reciever_roll_number: comment_reciever_id_edit,
          // isStudent:isStudent
        })
        .then((res) => {
          if (res.data.message === "No users found") {
            setMessage2(res.data.message);
            setApprovedComments([]);
          } else {
            // const approvedComments = res.data.approvedComments;
            setApprovedComments(res.data.approvedComments);
          }
        })
        .catch((err) => {});
    }
  }, [comment_reciever_id_edit]);

  return (
    <div className="fadeInUp h-screen bg-gray-800 ">
      <ToastContainer />
      <div class="main flex flex-row items-center justify-center">
        <div class="main2 flex justify-center flex-col w-1/2 h-6/10 ml-0">
          <div className="mx-auto relative top-10/4 left-10/4">
            {editCommentsUser && (
              <img
                src={editCommentsUser.profile_img}
                class="bg-white rounded-full border-2 border-black m-4"
                style={{ width: "170px", height: "170px" }}
                alt="profile"
              ></img>
            )}
          </div>
          {editCommentsUser && (
            <div
              className={`info block p-0 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-2 border-white"
                  : "bg-gray-900 text-white border-2 border-black"
              }`}
            >
              <div class="text-center ">
                {/* Profile Data here from backend */}
                <p>{editCommentsUser.name}</p>
                <p>Roll No: {editCommentsUser.roll_no}</p>
                <p>
                  {" "}
                  {editCommentsUser.academic_program},{" "}
                  {editCommentsUser.department}
                </p>
                <p> {editCommentsUser.about}</p>
              </div>
            </div>
          )}
        </div>

        <div class="flex justify-center  my-20 flex-col Comment mx-10 items-center">
          <div className="hed">
            <h2
              class={`text-4xl font-semibold ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              Edit Your Comment
            </h2>
          </div>

          <form className="flex flex-col items-center justify-center">
            <textarea
              onInput={handleInputChange}
              value={editComments}
              maxLength={300}
              rows={15}
              cols={50}
              className={`txtarea ${
                isDarkMode
                  ? "bg-gray-700 text-white border-2 border-white"
                  : "bg-white text-black border-2 border-black"
              }`}
              placeholder=" Add your Comment (upto 300 characters)"
              style={{ height: "300px" }}
              onChange={(e) => {
                setEditComments(e.target.value);
              }}
            ></textarea>
            <p class="text-gray-500 self-end relative">{300 - len}/300</p>
            <button
              className="self-end mt-1 rounded-2xl border-2 border-dashed border-black bg-white px-6 py-1 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
              onClick={handleSubmitedit}
            >
              {" "}
              Update Comment{" "}
            </button>
          </form>
          <h2>{message}</h2>
        </div>
      </div>

      <div>
        <div class="hed">
          <h2
            class={`text-4xl font-semibold ${
              isDarkMode ? "text-white" : "text-white"
            }`}
          >
            Approved Comments
          </h2>
        </div>
        <div className="flex flex-row flex-wrap mt-310">
          {approvedComments.map((val) => {
            return (
              <div
                className={`info w-1/4 overflow-y-auto h-40 text-black ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-2 border-white"
                    : "bg-white text-black border-2 border-black"
                }`}
              >
                <p className="cmt">{val.comment} </p>
                <p className="cmt">Name: {val.name} </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Editacomment;
