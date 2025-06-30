import "./makecomment.css";
import profImage from "./prof.jpg";
import { commtdata } from "./data";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import alumniData from "../Navbar/akumniData.json";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { forbiddenError, unauthorizedError } from "../../utils/authErrors";
// import jwt from 'jsonwebtoken';

export function Makeacomment({ isDarkMode, setIsDarkMode }) {
  const [decodedToken, setDecodedToken] = useState(null);
  const {
    user,
    setUser,
    setLoggedin,
    result,
    isStudent,
    setIsStudent,
    loggedin,
    profile,
    loading,
  } = useContext(LoginContext);
  console.log(profile);

  const { name, roll_no } = useParams();

  const navigate = useNavigate();

  useState(() => {
    if (!loading && loggedin == false) {
      navigate("/login");
    }
  });

  if (!isStudent && roll_no === profile.roll_no && name === profile.name) {
    window.location.href = `/profile/${profile.roll_no}/${profile.name}`;
  }

  const [len, setCommentlen] = useState(0);
  const [comment, setComment] = useState([]);
  const [comment2, setComment2] = useState("");
  const [user2, setUser2] = useState({});
  const [message2, setMessage2] = useState("");
  const [message, setMessage] = useState("");

  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   return storedThemeMode === "dark";
  // });

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = window.sessionStorage.getItem("google-token");

    // Check if token exists
    if (token) {
      try {
        // Decode the token
        const decoded = JSON.parse(atob(token.split(".")[1]));

        // Set the decoded token in state
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle error decoding token
      }
    } else {
      // Handle case when token doesn't exist in localStorage
      console.warn("Token not found in localStorage");
    }
  }, []);

  // Log decodedToken after useEffect
  useEffect(() => {}, [decodedToken]);

  // Getting Reciever's Comments
  useEffect(() => {
    if (profile) {
      axios
        .post(
          process.env.REACT_APP_API_URL + "/getRecieversComments2",
          {
            comment_reciever_roll_number: roll_no,
            isStudent: isStudent,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 404 || res.status === 500 || res.status === 400) {
            window.location.href = "/error";
          } else if (res.status === 401) {
            forbiddenError(setLoggedin, setUser);
          } else if (res.status === 403) {
            unauthorizedError(setLoggedin, setUser);
          }
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
  const handleSubmit2 = async (e) => {
    if (comment2.length == 0) {
      setMessage("Write a Comment");
    } else {
      e.preventDefault();
      const confirmed = window.confirm(
        "Are you sure you want to post this comment?"
      );

      if (confirmed) {
        await axios
          .post(
            process.env.REACT_APP_API_URL + "/comments",
            {
              comment_reciever_roll_no: roll_no,
              isStudent: isStudent,
              comment: comment2,
              status: "new",
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
              },
            }
          )
          .then((res) => {
            if (
              res.status === 404 ||
              res.status === 500 ||
              res.status === 400
            ) {
              window.location.href = "/error";
            }
            if (res.status === 401) {
              forbiddenError(setLoggedin, setUser);
            }
            if (res.status === 403) {
              unauthorizedError(setLoggedin, setUser);
            }
            toast("Comment Posted Successfully!", {
              theme: "dark",
              autoClose: 2000,
            });
          })
          .catch((err) => {});
        const timetonavigate = setTimeout(() => {
          {
            !isStudent
              ? navigate(`/profile/${profile.roll_no}/${profile.name}`)
              : navigate(`/userlist`);
          }
        }, 2000); // delay execution by 2 second

        return () => clearTimeout(timetonavigate);
      }

      window.localStorage.removeItem("searchAlumni");
    }
  };

  const handleInputChange = (event) => {
    let inputstr = event.target.value;
    setCommentlen(inputstr.length);
    setComment2(inputstr);
  };

  return (
    <div className="fadeInUp h-screen bg-[#1F2937]">
      <ToastContainer />
      <div class="main flex flex-row items-center justify-center">
        <div class="main2 flex justify-center flex-col w-[30%] h-[400px] ml-0 bg-[#111827] rounded-2xl top-[100px]">
          <div className="mx-auto relative top-[20px] left-10/4">
            <img
              src={user2.profImage}
              class="bg-white rounded-full object-cover border-2 border-black m-4"
              style={{ width: "150px", height: "150px" }}
              alt="profile"
            ></img>
          </div>
          <div
            className={`info block p-0 ${
              isDarkMode
                ? "bg-gray-700 text-white border-2 border-white"
                : "bg-[#1F2937] text-white border-2 border-black"
            }`}
          >
            <div class="text-center">
              {/* Profile Data here from backend */}
              <p>{user2.name}</p>
              <p>{user2.roll_no}</p>
              <p>{user2.about}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-center  my-20 flex-col Comment mx-10 items-center ">
          <div className="h-fit m-[12px] relative">
            <h2
              class={`text-4xl font-semibold ${
                isDarkMode ? "text-white" : "text-white"
              }`}
            >
              Make a Comment
            </h2>
          </div>
          <textarea
            onInput={handleInputChange}
            value={comment2}
            maxLength={300}
            rows={15}
            cols={50}
            className={`txtarea ${
              isDarkMode
                ? "bg-gray-700 text-white border-2 border-white"
                : "bg-white text-black border-2 border-black"
            }`}
            placeholder=" Add your Comment (upto 300 characters)"
            style={{ height: "250px" }}
          ></textarea>
          <p class="outof text-gray-500 self-end relative bottom-8 right-12">
            {300 - len}/300
          </p>
          <button
            onClick={handleSubmit2}
            className="self-end mr-10 mt-1 w-[190] rounded-2xl border-2 border-dashed border-black bg-white text-black px-6 py-1 font-semibold uppercase   transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
          >
            {" "}
            Post!{" "}
          </button>
          <>{message}</>
        </div>
      </div>
      <div className="bg-[#1F2937]">
        <div class="hed">
          <h2
            class={`text-4xl font-semibold items-center ${
              isDarkMode ? "text-white" : "text-white"
            }`}
          >
            Approved Comments
          </h2>
        </div>
        <div className="flex flex-row flex-wrap mt-310">
          {comment.map((val) => {
            return (
              <div
                className={`info2 w-[500px] overflow-y-auto h-40 text-black  ${
                  isDarkMode
                    ? "bg-gray-700 text-white  border-white"
                    : "bg-[#111827] text-white  border-black"
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

export default Makeacomment;
