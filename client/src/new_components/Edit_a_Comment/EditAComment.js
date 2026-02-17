import "./EditAComment.css";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function Editacomment({ isDarkMode }) {
  const { loggedin, loading, isStudent, profile } = useContext(LoginContext);
  const { userId, commentId } = useParams();
  const navigate = useNavigate();

  const [decodedToken, setDecodedToken] = useState(null);
  const [editComments, setEditComments] = useState("");
  const [len, setLen] = useState(0);
  const [editCommentsUser, setEditCommentsUser] = useState(null);
  const [approvedComments, setApprovedComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

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

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editComments.trim()) {
      toast("Comment cannot be empty!", { theme: "dark", autoClose: 3000 });
      return;
    }

    if (!window.confirm("Are you sure you want to edit this comment?")) return;

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
  };

  return (
    <div className="fadeInUp h-screen bg-gray-800">
      <ToastContainer />

      <div className="main flex flex-row items-center justify-center">
        <div className="main2 flex justify-center flex-col w-1/2">
          {editCommentsUser && (
            <>
              <img
                src={editCommentsUser.profile_img}
                className="bg-white rounded-full border-2 border-black m-4 mx-auto"
                style={{ width: "170px", height: "170px" }}
                alt="profile"
              />
              <div
                className={`info block p-4 ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-2 border-white"
                    : "bg-gray-900 text-white border-2 border-black"
                }`}
              >
                <div className="text-center">
                  <p className="font-bold">{editCommentsUser.name}</p>
                  <p>Roll No: {editCommentsUser.roll_no}</p>
                  <p>
                    {editCommentsUser.academic_program}, {editCommentsUser.department}
                  </p>
                  <p className="mt-2">{editCommentsUser.about}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center my-20 flex-col Comment mx-10 items-center">
          <h2
            className={`text-4xl font-semibold ${
              isDarkMode ? "text-black" : "text-white"
            }`}
          >
            Edit Your Comment
          </h2>

          <form className="flex flex-col items-center">
            <textarea
              value={editComments}
              maxLength={300}
              rows={15}
              cols={50}
              className={`txtarea ${
                isDarkMode
                  ? "bg-gray-700 text-white border-2 border-white"
                  : "bg-white text-black border-2 border-black"
              }`}
              placeholder="Edit your comment (up to 300 characters)"
              style={{ height: "300px" }}
              onChange={handleInputChange}
            />
            <p className="text-gray-500 self-end mt-1">
              {300 - len}/300
            </p>

            <button
              type="button"
              className="self-end mt-4 rounded-2xl border-2 border-dashed border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black]"
              onClick={handleSubmitEdit}
            >
              Update Comment
            </button>
          </form>
        </div>
      </div>

      {/* Approved Comments */}
      <div className="mt-12 px-8">
        <h2 className="text-4xl font-semibold text-white text-center mb-6">
          Approved Comments
        </h2>
        <div className="flex flex-row flex-wrap justify-center gap-4">
          {approvedComments.map((val, i) => (
            <div
              key={i}
              className={`info w-80 md:w-1/4 overflow-y-auto h-40 p-4 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-2 border-white"
                  : "bg-white text-black border-2 border-black"
              }`}
            >
              <p className="cmt">{val.comment}</p>
              <p className="cmt mt-2">— {val.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Editacomment;