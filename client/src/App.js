import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import PreviousYrBook from "./pages/PreviousYrBook.jsx";
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
// REMOVED:
// import alumniData from "./new_components/Navbar/alumniData.js";
import UserList from "./new_components/UserList.js";
// import UserList from "./components/navbar/UserList.js";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
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
import PollPage from "./new_components/PollPage/PollPage.js";
import PollResultsPage from "./new_components/PollPage/PollResultsPage";
import PreviousYrBookSenior from "./pages/PreviousYrBookSenior.jsx";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner, toast } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VerifyMemories from "./pages/VerifyMemories.jsx";
import CampusMapPage from "./pages/CampusMapPage.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import Footer from "./new_components/New_homepage/footer";

const queryClient = new QueryClient();

const App = ({ location }) => {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const pendingNoticeRef = useRef("");
  useEffect(() => {
    if (["/login", "/footer"].includes(pathname) || hash) return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.getElementById("root2")?.scrollTo(0, 0);
  }, [pathname, hash]);

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

  const [loginError, setLoginError] = useState("");
  const installSession = ({user: identity, profile: record}) => {
    setUser(identity);
    setProfile(record || {});
    setIsStudent(!identity.alumni);
    setOneTimeVerified(Boolean(record?.one_step_verified));
    setVerified(Boolean(record?.two_step_verified && record?.one_step_verified));
    setLoggedin(true);
  };

  useEffect(() => {
    let active = true;
    localStorage.removeItem("token");
    axios.get(process.env.REACT_APP_API_URL + "/auth/session")
      .then(({data}) => { if (active) installSession(data); })
      .catch(err => { if (active && err.response?.status !== 401) setLoginError("Could not restore your session."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loggedin || (!isStudent && !verified)) return;
    axios.get(process.env.REACT_APP_API_URL + "/getUsersData")
      .then(({data}) => setAllUsers(Array.isArray(data) ? data : []));
  }, [loggedin,isStudent,verified]);

  async function handleCallbackResponse({credential}) {
    try {
      setLoginError("");
      await axios.post(process.env.REACT_APP_API_URL + "/auth/login", {credential});
      const {data} = await axios.get(process.env.REACT_APP_API_URL + "/auth/session");
      installSession(data);
      const p = data.profile;
      const id = data.user.jti;
      if (!data.user.alumni) navigate("/goldcard");
      else if (!p) navigate("/fill/" + id);
      else if (!p.one_step_verified) navigate("/otpVerificationnew/" + id);
      else if (!p.two_step_verified) navigate("/emailverification/" + id);
      else navigate("/profile/" + p.roll_no + "/" + encodeURIComponent(p.name));
    } catch (err) { setLoginError(err.response?.data?.message || "Sign-in failed. Please try again."); }
  }
  useEffect(() => {
    const button = document.getElementById("google-login");
    if (!button) return;
    const renderButton = () => {
      if (!window.google?.accounts || !button.isConnected || button.firstChild) return;
      window.google.accounts.id.initialize({client_id: process.env.REACT_APP_CLIENT_ID, callback: handleCallbackResponse});
      window.google.accounts.id.renderButton(button, {theme:"outline",size:"large",shape:"pill"});
    };
    renderButton();
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    script?.addEventListener("load", renderButton);
    return () => script?.removeEventListener("load", renderButton);
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");

    return storedThemeMode === "dark";
  });

  const publicPaths = new Set([
    "/",
    "/login",
    "/logout",
    "/about",
    "/footer",
    "/team",
    "/issue",
    "/error",
    "/privacy-policy",
    "/terms",
  ]);
  const isPublic = publicPaths.has(pathname);
  const isOnboarding =
    pathname.startsWith("/fill/") ||
    pathname.startsWith("/otpVerificationnew/") ||
    pathname.startsWith("/emailverification/");
  const isStudentOnly =
    pathname === "/goldcard" ||
    pathname === "/Newp2" ||
    pathname.startsWith("/profile/nongrad/");
  const isAlumniOnly =
    pathname === "/polls" ||
    pathname.startsWith("/polls/results/") ||
    pathname === "/memory" ||
    pathname === "/verifyMemories" ||
    pathname.startsWith("/edit/") ||
    pathname === "/blackcard" ||
    pathname === "/Newp1" ||
    (pathname.startsWith("/profile/") && !pathname.startsWith("/profile/nongrad/"));

  let redirect;
  let guardNotice = "";
  if (!loading) {
    if (!loggedin) {
      if (!isPublic) {
        redirect = "/login";
        guardNotice = "You are not authorized. Please sign in first.";
      }
    } else if (user.alumni && !verified) {
      const step = !profile._id
        ? "fill"
        : !oneTimeVerified
          ? "otpVerificationnew"
          : "emailverification";
      const target = "/" + step + "/" + user.jti;
      const allowedMidSignup = new Set([
        "/",
        "/logout",
        "/about",
        "/privacy-policy",
        "/terms",
        "/team",
        "/footer",
      ]);
      const canLeaveSignup = step === "otpVerificationnew"
        ? pathname === "/logout"
        : allowedMidSignup.has(pathname);
      if (pathname !== target && !canLeaveSignup) {
        redirect = target;
        if (pathname !== "/login" && pathname !== "/") {
          guardNotice = "Complete verification before accessing portal pages.";
        }
      }
    } else if (!user.alumni) {
      const nongradEmail = pathname.startsWith("/profile/nongrad/")
        ? decodeURIComponent(pathname.split("/")[4] || "")
        : null;
      if (
        isOnboarding ||
        isAlumniOnly ||
        (nongradEmail !== null && nongradEmail !== user.email)
      ) {
        redirect = "/goldcard";
        guardNotice = "You are not authorized to access this page.";
      }
    } else {
      const homeProfile =
        "/profile/" + profile.roll_no + "/" + encodeURIComponent(profile.name || "");
      const targetRoll =
        pathname.startsWith("/profile/") || pathname.startsWith("/edit/")
          ? decodeURIComponent(pathname.split("/")[2] || "")
          : null;
      if (
        isOnboarding ||
        isStudentOnly ||
        (targetRoll !== null && targetRoll !== profile.roll_no)
      ) {
        redirect = homeProfile;
        guardNotice = "You are not authorized to access this page.";
      }
    }
  }

  if (guardNotice) pendingNoticeRef.current = guardNotice;

  useEffect(() => {
    if (!loading && !redirect && pendingNoticeRef.current) {
      toast.error(pendingNoticeRef.current, { id: "auth-guard" });
      pendingNoticeRef.current = "";
    }
  }, [loading, redirect, pathname]);

  if (loading) return <div role="status">Loading yearbook…</div>;
  if (redirect) return <Navigate replace to={redirect} />;
  const hideChromeOnOnboarding =
    /^\/fill\/.+$/.test(pathname) ||
    /^\/otpVerificationnew\/.+$/.test(pathname) ||
    /^\/Fill_Details3\/.+$/.test(pathname) ||
    /^\/emailverification\/.+$/.test(pathname) ||
    /^\/otpVerification\/.+$/.test(pathname);
  const isHomepageRoute = ["/", "/login", "/footer", "/logout"].includes(pathname);

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
        className={`App flex flex-col min-h-screen overflow-x-clip ${
          isHomepageRoute
            ? isDarkMode
              ? "bg-cover bg-bg-dark text-white"
              : "bg-cover bg-bg-white text-black"
            : "bg-pagebg text-white"
        }`}
      >
        {loginError && <p role="alert">{loginError}</p>}
        {!hideChromeOnOnboarding && pathname !== "*" && <Navbar />}

        <div className="flex-1 flex flex-col">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" richColors />

            <Routes>
              {/* Homepage */}
              <Route exact path="/" element={<Homepage2 />} />

              <Route exact path="/about" element={<About />} />

              <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />

              <Route exact path="/terms" element={<TermsOfService />} />

              <Route
                exact
                path="/profile/nongrad/:name/:email"
                element={<Nongrad />}
              />

              <Route exact path="/login" element={<Homepage2 />} />

              <Route exact path="/footer" element={<Homepage2 />} />

              <Route exact path="/logout" element={<Homepage2 />} />

              <Route
                path="/polls"
                element={
                  <PollPage
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                  />
                }
              />

              {/* Registration Page */}

              <Route
                exact
                path="/otpVerificationnew/:userId"
                element={<Fill1 />}
              />

              <Route
                exact
                path="/emailverification/:userId"
                element={<Fill2 />}
              />

              <Route
                exact
                path="/fill/:userId"
                element={
                  <Fill3
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                  />
                }
              />

              {/* Search Page */}

              <Route exact path="/userlist" element={<UserList />} />

              <Route
                exact
                path="/nav"
                element={
                  <div className="w-screen h-screen">
                    <Navbar />
                  </div>
                }
              />

              {/* Make a Comment Page */}

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

              <Route
                path="/polls/results/:pollId"
                element={<PollResultsPage />}
              />

              {/* Profile Page */}

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

              {/* Black and Gold Cards */}

              <Route exact path="/Newp1" element={<BlackCard />} />

              <Route exact path="/Newp2" element={<GoldCard />} />

              <Route
                exact
                path="/previous-yrbook"
                element={<PreviousYrBook />}
              />

              <Route
                exact
                path="/previous-yrbook/getSenior/:roll_no"
                element={<PreviousYrBookSenior />}
              />

              {/* Extra Pages */}

              <Route path="/memory" element={<Index />} />
              <Route path="/map" element={<CampusMapPage />} />

              <Route path="*" element={<NotFound />} />

              <Route
                exact
                path="/verifyMemories"
                element={<VerifyMemories />}
              />
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
        </div>

        {!loading &&
          !isHomepageRoute &&
          !hideChromeOnOnboarding &&
          pathname !== "/nav" &&
          pathname !== "/map" && <Footer />}
      </div>
    </LoginContext.Provider>
  );
};

export default App;
