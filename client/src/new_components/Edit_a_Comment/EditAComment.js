import "./EditAComment.css";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog, { useConfirmDialog } from "../../components/ConfirmDialog";
import CommentGrid from "../../components/CommentGrid";

export function Editacomment({ isDarkMode }) {
  const { loggedin, loading, isStudent, profile } = useContext(LoginContext);
  const { userId, commentId } = useParams();
  const navigate = useNavigate();

  const {user: decodedToken} = useContext(LoginContext);
  const [editComments, setEditComments] = useState("");
  const [len, setLen] = useState(0);
  const [editCommentsUser, setEditCommentsUser] = useState(null);
  const [approvedComments, setApprovedComments] = useState([]);
  const { openConfirm, dialogProps } = useConfirmDialog();

  useEffect(() => {
    if (!loading && !loggedin) {
      navigate("/login");
    }
  }, [loading, loggedin, navigate]);

  useEffect(() => {
    const fetchEditInfo = async () => {
      if (!userId || !commentId || !decodedToken) return;

      try {
        const res = await axios.post(
          process.env.REACT_APP_API_URL + "/getEditCommentsInfo",
          {
            comment_reciever_id_edit: userId,
            comment_id_edit: commentId,
            isStudent: isStudent,
          }
        );

        const data = res.data;

        if (data.message === "No userData found" || !data.comment) {
          toast("Comment not found", { theme: "dark" });
          navigate(-1);
          return;
        }

        const commentText = data.comment.comment || "";
        setEditComments(commentText);
        setLen(commentText.length);
        setEditCommentsUser(data.user);
      } catch (err) {
        console.error(err);
        toast("Failed to load comment", { theme: "dark" });
      }
    };

    fetchEditInfo();
  }, [userId, commentId, isStudent, decodedToken, navigate]);

  useEffect(() => {
    if (!userId) return;

    axios
      .post(process.env.REACT_APP_API_URL + "/getRecieversComments2", {
        comment_reciever_roll_number: userId,
        isStudent: isStudent,
      })
      .then((res) => {
        if (res.data.message?.includes("not found")) {
          setApprovedComments([]);
        } else {
          setApprovedComments(res.data.approvedComments || []);
        }
      })
      .catch((err) => console.error(err));
  }, [userId, isStudent]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEditComments(value);
    setLen(value.length);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    if (!editComments.trim()) {
      toast("Comment cannot be empty!", { theme: "dark", autoClose: 3000 });
      return;
    }

    openConfirm({
      title: "Update Comment",
      message: "Are you sure you want to edit this comment?",
      confirmLabel: "Update",
      onConfirm: async () => {
        try {
          await axios.post(
            process.env.REACT_APP_API_URL + "/editComment",
            {
              comment: editComments,
              comment_reciever_id_edit: userId,
              comment_id_edit: commentId,
              isStudent: isStudent,
            }
          );

          toast("Comment Edited Successfully!", { theme: "dark", autoClose: 1500 });

          setTimeout(() => {
            if (!isStudent) {
              navigate(`/profile/${profile?.roll_no}/${profile?.name}`);
            } else {
              navigate("/userlist");
            }
          }, 1800);
        } catch (err) {
          console.error(err);
          toast("Failed to edit comment", { theme: "dark", autoClose: 3000 });
        }
      },
    });
  };

  return (
    <div className="fadeInUp min-h-screen w-full bg-pagebg text-white overflow-x-hidden py-8 sm:py-12">
      <ToastContainer />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none bg-[#111827] rounded-2xl flex flex-col items-center pb-6">
            {editCommentsUser && (
              <>
                <div className="mx-auto pt-6 pb-2">
                  <img
                    src={editCommentsUser.profile_img}
                    className="w-32 h-32 sm:w-[150px] sm:h-[150px] bg-white rounded-full border-2 border-black m-2 object-cover"
                    alt="profile"
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
                      {editCommentsUser.name}
                    </p>
                    <p className="text-gray-300 break-words">
                      Roll No: {editCommentsUser.roll_no}
                    </p>
                    <p className="text-gray-300 break-words">
                      {editCommentsUser.academic_program}, {editCommentsUser.department}
                    </p>
                    <p className="break-words whitespace-pre-line leading-relaxed pt-1">
                      {editCommentsUser.about}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none px-1 sm:px-2 flex flex-col">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4 text-center">
              Edit Your Comment
            </h2>

            <form className="flex flex-col w-full">
              <textarea
                value={editComments}
                maxLength={300}
                rows={8}
                className="w-full min-h-[220px] sm:min-h-[250px] rounded-lg px-4 py-3.5 text-base leading-relaxed resize-y bg-[#111827] text-white placeholder-gray-400 border border-black/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]/60 transition-shadow"
                placeholder="Edit your comment (up to 300 characters)"
                onChange={handleInputChange}
              />
              <p className="text-xs sm:text-sm text-gray-400 self-end mt-2 px-1">
                {300 - len}/300
              </p>

              <div className="flex justify-end mt-2.5">
                <button
                  type="button"
                  className="w-full sm:w-auto min-w-[160px] rounded-2xl border-2 border-dashed border-black bg-white px-7 py-2 font-semibold uppercase text-black transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] cursor-pointer"
                  onClick={handleSubmitEdit}
                >
                  Update Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Approved Comments */}
      <CommentGrid
        title="Approved Comments"
        items={approvedComments.map((val, idx) => ({
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

export default Editacomment;