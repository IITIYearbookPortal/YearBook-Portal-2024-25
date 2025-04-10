import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./new_components/Navbar/Navbar";
// import Cards from "./components/team/Cards.jsx";
// import MakeAComment from "./components/Make_a_Comment/MakeAComment";
import Make_Comment from "./new_components/MakeComment2/Makeacomment.js";
// import SecondLogin from "./components/SecondLogin/SecondLogin";
// import Fill from "./components/Fill_Details/Fill";
import Edit from "./new_components/Edit_Profile/Edit";
import Fill1 from "./new_components/not_verified_otp/otpVerificationnew";
import Fill2 from "./new_components/email_not_verified/emailverification";
// import Homepage from "./components/Homepage/Homepage";
import Error from "./new_components/Error/Error";
// import Internet from "./components/Internet/Internet";
import alumniData from "./new_components/Navbar/akumniData.json";
import UserList from "./new_components/UserList.js";
// import UserList from "./components/navbar/UserList.js";
import { Route, Routes, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { LoginContext } from "./helpers/Context";
import axios from "axios";
import EditAComment from "./new_components/Edit_a_Comment/EditAComment";

import Fill3 from "./new_components/Fill_Details3/Fill_Details3.js";
import Homepage2 from "./new_components/New_homepage/home.jsx";

import Prof from "./new_components/prof/prof.js";

import Nongrad from "./new_components/nongradprof/nongrad.js";
import GoldCard from "./new_components/MemberCards/GoldCard.js";
import BlackCard from "./new_components/MemberCards/BlackCard.js";
import About from "./new_components/About/about.jsx";
import DevP from "./new_components/developers_page/devp.js";
import PollPage from './new_components/PollPage/PollPage.js';
import PollResultsPage from "./new_components/PollPage/PollResultsPage";

const App = ({ location }) => {
  const [user, setUser] = useState({});
  const [loggedin, setLoggedin] = useState(false);
  const [result, setResult] = useState({});
  const [fill, setFill] = useState(false);
  const [profile, setProfile] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [oneTimeVerified, setOneTimeVerified] = useState(false);
  const [verified, setVerified] = useState(false);
  const [profileIcon, setProfileIcon] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    roll_no: "",
    academic_program: "",
    department: "",
    personal_email_id: "",
    contact_details: "",
    alternate_contact_details: "",
    address: "",
    current_company: "",
    designation: "",
    about: "",
    question_1: "",
    question_2: "",
  });

  const navigate = useNavigate();

  const alumniEmail = alumniData;

  // Get all users' name branch and email id
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getUsersData")
      .then((res) => {
        setAllUsers(res.data); // Updated variable name
      })
      .catch((err) => {});
  }, []);

  // Google authentication for IITI students
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleCallbackResponse,
        hosted_domain: "iiti.ac.in",
      });
      google.accounts.id.renderButton(document.getElementById("google-login"), {
        theme: "dark",
        size: "large",
        width: "large",
      });
    }
  });

  // Callback Function after logging in
  async function handleCallbackResponse(response) {
    // Getting all the data from Google for the user who signs in
    var userObject = jwt_decode(response.credential);

    window.localStorage.setItem("token", response.credential);

    // setLoggedin(true)
    const email = userObject.email;
    if (!email.endsWith('@iiti.ac.in')) {
    // Handle unauthorized access
    console.error('Unauthorized domain');
    alert('Please use your IITI email address to login');
    return;
    }

    await axios
      .post(process.env.REACT_APP_API_URL + "/checkAuth", {
        email: userObject.email,
      })
      .then((res) => {
        // If the user already exists in the auth model
        if (res.data.message === "true") {
          // If the user is an alumni
          if (alumniEmail.includes(userObject.email)) {
            axios
              .post(process.env.REACT_APP_API_URL + "/findAUser", {
                email: userObject.email,
              })
              .then((res) => {
                // If the user had made his profile
                if (res.data.message === "User Found") {
                  //If the user is not one time verified
                  if (res.data.User2[0].one_step_verified === true) {
                    setOneTimeVerified(true);
                  } else {
                    navigate(`/otpVerificationnew/${userObject.jti}`);
                  }

                  // If the user is two step verified
                  if (res.data.User2[0].two_step_verified === true) {
                    setVerified(true);
                    setProfile(res.data.User2[0]);
                    navigate(
                      `/profile/${res.data.User2[0].roll_no}/${res.data.User2[0].name}`
                    );
                    setLoggedin(true);
                  } else {
                    if (res.data.User2[0].one_step_verified === true) {
                      setOneTimeVerified(true);
                      navigate(`/emailverification/${userObject.jti}`);
                    } else {
                      navigate(`/otpVerificationnew/${userObject.jti}`);
                    }
                    // If the user is not verified
                  }
                  // If the user has not made the profile but already exists in the auth
                  // then navigate the user to the fill page
                } else {
                  navigate(`/fill/${userObject.jti}`);
                }
              });
          }

          // If the user is a student
          else {
            setIsStudent(true);
            setLoggedin(true);
            navigate("/goldcard");
          }
        }
        // If signed in for the first time
        else {
          axios
            .post(process.env.REACT_APP_API_URL + "/auth", {
              email: userObject.email,
              name: userObject.name,
            })
            .then((res) => {
              // If alumni
              if (alumniEmail.includes(userObject.email)) {
                navigate(`/fill/${userObject.jti}`);
              }
              // If student
              else {
                setIsStudent(true);
                setLoggedin(true);
                navigate("/goldcard");
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  }

  //on reloading check if credentials exist in the localstorage if does exit check if student then set loggedin true
  //if an alumni, check if two time verified set logged in and verified true
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token !== null) {
      const auth = jwt_decode(token);
      if (alumniData.includes(auth.email)) {
        axios
          .post(process.env.REACT_APP_API_URL + "/findAUser", {
            email: auth.email,
          })
          .then((res) => {
            // If the user had made his profile
            if (res.data.message === "User Found") {
              // If the user is two step verified
              if (res.data.User2[0].two_step_verified === true) {
                setVerified(true);
                setProfile(res.data.User2[0]);
                setLoggedin(true);
                setLoading(false);
              }
            }
          });
      } else {
        setLoggedin(true);
        setIsStudent(true);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode === "dark";
  });

  return (
    <LoginContext.Provider
      value={{
        loggedin,
        setLoggedin,
        user,
        setUser,
        result,
        setResult,
        fill,
        setFill,
        profile,
        setProfile,
        allUsers,
        verified,
        setVerified,
        profileIcon,
        verified,
        setProfileIcon,
        userData,
        setUserData,
        isStudent,
        setIsStudent,
        oneTimeVerified,
        setOneTimeVerified,
        loading,
      }}
    >
      <div
        id="root2"
        className={`App overflow-x-hidden bg-cover ${
          isDarkMode ? "bg-bg-dark text-white" : "bg-bg-white text-black"
        }`}
      >
        {!/^\/fill\/.+$/.test(window.location.pathname) &&
          !/^\/otpVerificationnew\/.+$/.test(window.location.pathname) &&
          !/^\/Fill_Details3\/.+$/.test(window.location.pathname) &&
          !/^\/emailverificaton\/.+$/.test(window.location.pathname) &&
          !/^\/otpVerification\/.+$/.test(window.location.pathname) &&
          /* window.location.pathname !== "/otpVerificationnew/:userId" &&
          window.location.pathname !== "/Fill_Details3/:userId" &&
          window.location.pathname !== "/emailverification/:userId" &&
          window.location.pathname !== "/otpVerification/:userId" && */
          // window.location.pathname !== "/goldcard" &&
          // window.location.pathname !== "/blackcard" &&
          window.location.pathname !== "*" && <Navbar />}
        <Routes>
          {/* Homepage */}
          {/* <Route exact path="/oldHomepage" element={<Homepage />} /> */}

          {/* <Route path="/changetheme" element={<ThemeSettings toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} /> */}

          <Route exact path="/" element={<Homepage2 />} />

          <Route exact path="/about" element={<About />} />
          {/* <Route exact path = "/profile/nongrad" element = {<Nongrad />} /> */}
          <Route
            exact
            path="/profile/nongrad/:name/:email"
            element={<Nongrad />}
          />
          <Route exact path="/login" element={<Homepage2 />} />
          <Route exact path="/footer" element={<Homepage2 />} />
          <Route exact path="/logout" element={<Homepage2 />} />
          
          <Route path="/polls" element={<PollPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />

          {/* Registration Page */}
          {/* <Route exact path="/fill/:userId/old" element={<Fill />} /> */}
          <Route exact path="/otpVerificationnew/:userId" element={<Fill1 />} />
          <Route exact path="/emailverification/:userId" element={<Fill2 />} />
          <Route
            exact
            path="/fill/:userId"
            element={
              <Fill3 isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            }
          />

          {/* Search Page */}
          {<Route exact path="/userlist" element={<UserList />} />}

          {
            <Route
              exact
              path="/nav"
              element={
                <div className="w-screen h-screen  ">
                  <Navbar />
                </div>
              }
            />
          }

          {/* Make a Comment Page */}
          {/* <Route
            exact
            path="/comment/:name/:roll_no/old"
            element={<MakeAComment />}
          /> */}
          <Route
            exact
            path="/comment/:name/:roll_no"
            element={
              <Make_Comment
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            }
          />
           <Route path="/polls/results/:pollId" element={<PollResultsPage />} /> {/* Poll results route */}
          {/* Profile Page */}
          {/* <Route exact path="/profile/:roll/:name/old" element={<SecondLogin />} /> */}
          <Route
            exact
            path="/profile/:roll/:name"
            element={
              <Prof isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            }
          />

          {/* Cards */}
          <Route exact path="/goldcard" element={<GoldCard />} />
          <Route exact path="/blackcard" element={<BlackCard />} />

          {/* Edit Profile Page */}
          <Route
            exact
            path="/edit/:roll/:name"
            element={
              <Edit isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            }
          />

          {/* Edit a Comment Page */}
          <Route
            exact
            path="/comment/edit/:userId/:commentId"
            element={
              <EditAComment
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            }
          />

          {/* About Page */}
          {/* <Route exact path="/about" element={<About />} /> */}

          {/* Team Page */}
          <Route
            exact
            path="/team"
            element={
              <DevP isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            }
          />

          {/* Error Pages */}
          <Route exact path="*" element={<Error />} />
          <Route exact path="/issue" element={<Error />} />

          {/* Balck and Gold Cards */}
          <Route exact path="/Newp1" element={<BlackCard />} />
          <Route exact path="/Newp2" element={<GoldCard />} />
        </Routes>

        {/* {!loading && <Footer />} */}
      </div>
    </LoginContext.Provider>
  );
};

export default App;
