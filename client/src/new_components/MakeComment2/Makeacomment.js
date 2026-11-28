import "./makecomment.css";
import profImage from "./prof.jpg";
import { commtdata } from "./data";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import alumniData from "../Navbar/alumniData";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "../../components/Avatar";
import ConfirmDialog, { useConfirmDialog } from "../../components/ConfirmDialog";
import CommentGrid from "../../components/CommentGrid";
// import jwt from 'jsonwebtoken';

export function Makeacomment({ isDarkMode, setIsDarkMode }) {
  const { result, isStudent, setIsStudent, user, loggedin, profile, loading } =
    useContext(LoginContext);

  const { name, roll_no } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && loggedin === false) {
      navigate("/login");
    }
  }, [loading, loggedin, navigate]);

  useEffect(() => {
    if (!isStudent && profile && roll_no === profile.roll_no && name === profile.name) {
      navigate(`/profile/${profile.roll_no}/${profile.name}`, { replace: true });
    }
  }, [isStudent, profile, roll_no, name, navigate]);

  const [len, setCommentlen] = useState(0);
  const [comment, setComment] = useState([]);
  const [comment2, setComment2] = useState("");
  const [user2, setUser2] = useState({});
  const [message2, setMessage2] = useState("");
  const [message, setMessage] = useState("");
  const { openConfirm, dialogProps } = useConfirmDialog();

  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   return storedThemeMode === "dark";
  // });

  // Getting Reciever's Comments
  useEffect(() => {
    if (profile) {
      axios
        .post(process.env.REACT_APP_API_URL + "/getRecieversComments2", {
          comment_reciever_roll_number: roll_no,
          isStudent: isStudent,
        })
        .then((res) => {
          if (res.data.message === "User not found for the given roll_no") {
            navigate("/error");
            setMessage2(res.data.message);
            setComment([]);
          } else if (res.data.message === "No userData found") {
            setMessage2(res.data.message);
            setUser2(res.data.user);
            setComment([]);
          } else {
            setComment(res.data.approvedComments);
            setMessage2(res.data.message);
            setUser2(res.data.user);
          }
        })
        .catch((err) => {});
    }
  }, [profile]);
  const handleSubmit2 = (e) => {
    if (comment2.length == 0) {
      setMessage("Write a Comment");
    } else {
      e.preventDefault();
      openConfirm({
        title: "Post Comment",
        message: "Are you sure you want to post this comment?",
        confirmLabel: "Post Comment",
        onConfirm: async () => {
          await axios
            .post(process.env.REACT_APP_API_URL + "/comments", {
              // comment_sender_email: profile.email,
              comment_sender_email: user.email,
              comment_reciever_roll_no: roll_no,
              isStudent: isStudent,
              comment: comment2,
              status: "new",
            })
            .then((res) => {
              toast("Comment Posted Successfully!", {
                theme: "dark",
                autoClose: 2000,
              });
            })
            .catch((err) => {});
          window.localStorage.removeItem("searchAlumni");
          setTimeout(() => {
            if (!isStudent) {
              navigate(`/profile/${profile.roll_no}/${profile.name}`);
            } else {
              navigate(`/userlist`);
            }
          }, 2000); // delay execution by 2 second
        },
      });
    }
  };

  const handleInputChange = (event) => {
    const inputstr = event.target.value;
    setCommentlen(inputstr.length);
    setComment2(inputstr);
    if (message && inputstr.length > 0) {
      setMessage("");
    }
  };

  return (
    <div className="fadeInUp min-h-screen w-full bg-pagebg text-white overflow-x-hidden py-8 sm:py-12">
      <ToastContainer />

      {/* Top Section: Profile Card + Make a Comment */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Recipient Profile Card (original style, wider & responsive) */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none bg-[#111827] rounded-2xl flex flex-col items-center pb-6">
            <div className="mx-auto pt-6 pb-2">
              <Avatar
                src={user2.profImage}
                alt={user2.name || "profile"}
                className="w-32 h-32 sm:w-[150px] sm:h-[150px] rounded-full border-2 border-black m-2"
              />
            </div>

            <div
              className={`w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] mx-4 sm:mx-6 mt-3 px-5 py-4 rounded-[14px] shadow-[2px_2px_4px_#49474a] break-words ${
                isDarkMode
                  ? "bg-gray-700 text-white border-2 border-white"
                  : "bg-pagebg text-white border-2 border-black"
              }`}
            >
              <div className="text-center space-y-2 text-sm sm:text-base">
                <p className="font-yearbook-fun text-2xl sm:text-3xl text-white break-words">
                  {user2.name}
                </p>
                <p className="text-gray-300 break-words">{user2.roll_no}</p>
                <p className="break-words whitespace-pre-line leading-relaxed pt-1">
                  {user2.about}
                </p>
              </div>
            </div>
          </div>

          {/* Comment Composer */}
          <div className="lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none px-1 sm:px-2 flex flex-col">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4 text-center">
              Make a Comment
            </h2>

            <textarea
              onChange={handleInputChange}
              value={comment2}
              maxLength={300}
              rows={8}
              className="w-full min-h-[220px] sm:min-h-[250px] rounded-lg px-4 py-3.5 text-base leading-relaxed resize-y bg-[#111827] text-white placeholder-gray-400 border border-black/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]/60 transition-shadow"
              placeholder="Add your Comment (upto 300 characters)"
            />

            <div className="flex items-center justify-between gap-3 mt-2.5 px-1">
              <div className="min-h-[1.25rem]">
                {message && (
                  <p className="text-sm text-red-400">{message}</p>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 shrink-0">
                {300 - len}/300
              </p>
            </div>

            <div className="flex justify-end mt-2.5">
              <button
                type="button"
                onClick={handleSubmit2}
                className="w-full sm:w-auto min-w-[160px] rounded-2xl border-2 border-dashed border-black bg-white text-black px-7 py-2 font-semibold uppercase transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer"
              >
                Post!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Approved Comments Section */}
      <CommentGrid
        title="Approved Comments"
        items={comment.map((val, idx) => ({
          id: val._id || idx,
          message: val.comment,
          author: val.name,
        }))}
        emptyText="No approved comments yet."
        isDarkMode={isDarkMode}
      />

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}

export default Makeacomment;
