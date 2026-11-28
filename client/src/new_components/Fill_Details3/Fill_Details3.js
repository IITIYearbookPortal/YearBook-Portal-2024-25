import React, { useState, useEffect } from "react";
import profilepic from "./profile.jpeg";
import arrow from "./arrow.png";
import "./filldetails.module.css";
import phoneimg from "./telephone-call.png";
import Abtn from "./image.png";
import Bbtn from "./back-arrow.png";
import emailimg from "./email.png";
import grad from "./graduated.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { LoginContext } from "../../helpers/Context";
import { useContext } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useParams } from "react-router-dom";


const SELECT_FIELD_CLASS =
  "w-full appearance-none pl-4 pr-11 py-2 text-sm sm:text-base text-center rounded-xl border-2 border-white bg-[#111827] text-[#EEEEEE] focus:outline-none focus:border-[#76ABAE] transition-colors cursor-pointer";

const EXTRA_FIELD_CLASS =
  "w-full px-3.5 py-2.5 rounded-xl bg-[#1f2937]/80 border border-gray-500 text-[#EEEEEE] placeholder-gray-400 text-sm focus:outline-none focus:border-[#76ABAE] focus:ring-1 focus:ring-[#76ABAE] transition-colors";

/** Downward chevron spaced cleanly away from the right border of <select> inputs. */
const SelectChevron = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#EEEEEE]"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" />
  </svg>
);

function Fill3({ isDarkMode, setIsDarkMode }) {
  const {
    userData,
    setUserData,
    loggedin,
    setFill,
    isStudent,
    loading,
    verified,
    profile,
  } = useContext(LoginContext);

  const {user} = useContext(LoginContext);
  const jti = useParams();

  useEffect(() => {
    if (!loading) {
      if (verified) {
        window.location.href = `/profile/${profile.roll_no}/${profile.name}`;
      }
      if (isStudent || user.jti !== jti.userId) {
        window.location.href = "/error";
      }
    }
  });

  useEffect(() => {
    if (loading || !loggedin || isStudent) return;
    let active = true;
    axios
      .get(process.env.REACT_APP_API_URL + "/userData/academic-profile", {
        withCredentials: true,
      })
      .then(({ data }) => {
        if (!active || !data) return;
        setUserData((prev) => ({
          ...prev,
          roll_no: data.roll_no || prev.roll_no,
          department: data.department || prev.department,
          academic_program: data.academic_program || prev.academic_program,
        }));
        if (data.roll_no) setRollNo(data.roll_no);
        if (data.department) setDeprt(data.department);
        if (data.academic_program) setAcadP(data.academic_program);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [loading, loggedin, isStudent]);

  const [message, setMessage] = useState("");
  const [state, setState] = useState(false);
  const [hid, setHid] = useState(1);

  const [Name, setName] = useState("");
  const [RollNo, setRollNo] = useState("");
  const [AcadP, setAcadP] = useState("");
  const [Deprt, setDeprt] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [phone, setPhone] = useState("");
  const [alternate_contact_details, setalternate_contact_details] = useState("");
  const [address, setaddress] = useState("");
  const [current_company, setcurrent_company] = useState("");
  const [designation, setdesignation] = useState("");
  const [about, setabout] = useState("");
  const [question_2, setquestion_2] = useState("");
  const [question_1, setquestion_1] = useState("");

  const [isValidR, setIsValidR] = useState(true);
  const [len, setlen] = useState(0);

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (event) => {
    setlen(event.target.value.length);
  };

  const HandleEmpty = (e) => {
    if (e === "") {
      toast("Please fill all the details !", { theme: "dark", autoClose: 3000 });
    }
  };

  const HandleROll = () => {
    toast("Roll Number can only be in Digits", { theme: "dark", autoClose: 3000 });
  };

  const HandleDigitsOnly = (event) => {
    const containsOnlyDigits = /^\d+$/.test(event.target.value);
    setIsValidR(containsOnlyDigits);
    setRollNo(event.target.value);
  };

  // Save a pending profile before requesting the verification codes.
  const onSubmit = () => {
    setState(true);

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", userData.name);
    formData.append("roll_no", userData.roll_no);
    formData.append("academic_program", userData.academic_program);
    formData.append("department", userData.department);
    formData.append("personal_email_id", userData.personal_email_id);
    formData.append("contact_details", userData.contact_details);
    formData.append("alternate_contact_details", userData.alternate_contact_details);
    formData.append("address", userData.address);
    formData.append("current_company", userData.current_company);
    formData.append("designation", userData.designation);
    formData.append("about", userData.about);
    formData.append("question_1", userData.question_1);
    formData.append("question_2", userData.question_2);
    formData.append("profile_img", profileImage);
    axios
      .post(process.env.REACT_APP_API_URL + "/userData", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({data}) => {
        if (data.message !== "Profile created") throw new Error(data.message);
        window.location.assign("/otpVerificationnew/" + user.jti);
      })
      .catch((err) => {
        setState(false);
        toast.error(
          err?.response?.data?.message || err?.message || "Something went wrong. Please try again.",
          { theme: "dark", autoClose: 3000 },
        );
      });
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen w-full overflow-x-hidden bg-pagebg">

        {/* Page 1 – Name */}
        <div
          className={
            hid == 1
              ? "min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8 py-12 relative border-b-2 border-gray-700 bg-pagebg text-center"
              : "hidden"
          }
        >
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8 afu">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#EEEEEE] leading-tight">
              Just To Verify Your Name Is ?
            </h1>

            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={userData.name}
              className="w-full max-w-xs px-4 py-2 text-base sm:text-lg text-center border-2 rounded-xl border-white bg-transparent text-[#EEEEEE] placeholder-gray-400 focus:outline-none focus:border-[#76ABAE] transition-colors"
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setName(e.target.value);
              }}
            />

            <button
              onClick={() => {
                const cleanName = (Name || userData.name || "").trim();
                setUserData({ ...userData, name: cleanName });
                setName(cleanName);
                HandleEmpty(cleanName);
                if (cleanName) setHid(2);
              }}
              className="border-2 border-white bg-transparent text-white flex justify-center items-center px-8 py-3 text-base leading-none text-center rounded-3xl btnh border-dashed cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Page 2 – Academic Details (pre-filled from AlumniData by email; user verifies & presses Continue) */}
        <div
          className={
            hid == 2
              ? "min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8 py-16 relative border-b-2 border-gray-700 bg-pagebg text-[#EEEEEE]"
              : "hidden"
          }
        >
          <button
            onClick={() => setHid(1)}
            aria-label="Back to Name"
            className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20"
          >
            <img
              src={Bbtn}
              alt="Back"
              className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full btnh2 afr ${isDarkMode ? "bg-gray-400" : "bg-transparent"}`}
            />
          </button>

          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-4 pt-8 afr">
            <p className="text-xl sm:text-3xl lg:text-4xl font-medium">
              Right, of course we knew that 🙄
            </p>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold">
              Verify your academic details to continue
            </h1>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              <div className="flex flex-col items-center gap-2">
                <label className="text-sm sm:text-base lg:text-lg font-medium text-[#EEEEEE]">
                  Enrollment number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter"
                  name="roll_no"
                  value={userData.roll_no || ""}
                  className="w-full max-w-xs px-3.5 py-2 text-sm sm:text-base text-center rounded-xl border-2 border-white bg-transparent text-[#EEEEEE] placeholder-gray-400 focus:outline-none focus:border-[#76ABAE] transition-colors"
                  onChange={(e) => {
                    setUserData({ ...userData, [e.target.name]: e.target.value });
                    setRollNo(e.target.value);
                    HandleDigitsOnly(e);
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <label className="text-sm sm:text-base lg:text-lg font-medium text-[#EEEEEE]">
                  Academic Program
                </label>
                <div className="relative w-full max-w-xs">
                  <select
                    name="academic_program"
                    value={userData.academic_program || ""}
                    className={SELECT_FIELD_CLASS}
                    onChange={(e) => {
                      setAcadP(e.target.value);
                      setUserData({ ...userData, [e.target.name]: e.target.value });
                    }}
                  >
                    <option value="" disabled className="bg-[#111827]">Academic Program</option>
                    <option value="Bachelor of Technology (BTech)" className="bg-[#111827]">Bachelor of Technology (BTech)</option>
                    <option value="Master of Technology (MTech)" className="bg-[#111827]">Master of Technology (MTech)</option>
                    <option value="Master of Science (MSc)" className="bg-[#111827]">Master of Science (MSc)</option>
                    <option value="Five Year BTech + MTech" className="bg-[#111827]">Five Year BTech + MTech</option>
                    <option value="MS (Research)" className="bg-[#111827]">MS (Research)</option>
                    <option value="Doctor of Philosophy" className="bg-[#111827]">Doctor of Philosophy</option>
                    <option value="MS-DSM" className="bg-[#111827]">MS-DSM</option>
                  </select>
                  <SelectChevron />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <label className="text-sm sm:text-base lg:text-lg font-medium text-[#EEEEEE]">
                  Department
                </label>
                <div className="relative w-full max-w-xs">
                  <select
                    name="department"
                    value={userData.department || ""}
                    className={SELECT_FIELD_CLASS}
                    onChange={(e) => {
                      setDeprt(e.target.value);
                      setUserData({ ...userData, [e.target.name]: e.target.value });
                    }}
                  >
                    <option value="" disabled className="bg-[#111827]">Department</option>
                    <option value="Computer Science and Engineering" className="bg-[#111827]">Computer Science and Engineering</option>
                    <option value="Electrical Engineering" className="bg-[#111827]">Electrical Engineering</option>
                    <option value="Mechanical Engineering" className="bg-[#111827]">Mechanical Engineering</option>
                    <option value="Civil Engineering" className="bg-[#111827]">Civil Engineering</option>
                    <option value="Metallurgical Engineering and Materials Science" className="bg-[#111827]">Metallurgical Engineering and Materials Science</option>
                    <option value="Astronomy, Astrophysics and Space Engineering" className="bg-[#111827]">Astronomy, Astrophysics and Space Engineering</option>
                    <option value="Biosciences and Biomedical Engineering" className="bg-[#111827]">Biosciences and Biomedical Engineering</option>
                    <option value="Physics" className="bg-[#111827]">Physics</option>
                    <option value="Chemistry" className="bg-[#111827]">Chemistry</option>
                    <option value="Mathematics" className="bg-[#111827]">Mathematics</option>
                    <option value="Humanities and Social Sciences" className="bg-[#111827]">Humanities and Social Sciences</option>
                    <option value="Electric Vehicle Technology" className="bg-[#111827]">Electric Vehicle Technology</option>
                    <option value="MS-DSM" className="bg-[#111827]">MS-DSM</option>
                    <option value="Center of Futuristic Defense and Space Technology(CFDST)" className="bg-[#111827]">Center of Futuristic Defense and Space Technology(CFDST)</option>
                  </select>
                  <SelectChevron />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const dept = userData.department || Deprt;
                const prog = userData.academic_program || AcadP;
                const rollVal = userData.roll_no || RollNo;
                if (!dept || !prog || !rollVal) {
                  setHid(2);
                  HandleEmpty("");
                } else if (/^\d{1,10}$/.test(rollVal)) {
                  setHid(3);
                } else {
                  HandleROll();
                }
              }}
              className="mt-8 border-2 border-[#EEEEEE] bg-transparent text-[#EEEEEE] flex justify-center items-center px-8 py-3 text-base leading-none text-center rounded-3xl btnh border-dashed cursor-pointer"
            >
              Continue
            </button>
          </div>

          <img
            src={grad}
            alt=""
            className="hidden md:block absolute bottom-6 right-6 lg:bottom-8 lg:right-12 w-36 h-36 lg:w-44 lg:h-44 opacity-90 pointer-events-none"
          />
        </div>

        {/* Page 3 – Phone */}
        <div
          className={
            hid == 3
              ? "min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 py-16 relative border-b-2 border-gray-700 fadeInRight bg-pagebg text-center"
              : "hidden"
          }
        >
          <button
            onClick={() => setHid(2)}
            aria-label="Back to Academic Details"
            className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20"
          >
            <img
              src={Bbtn}
              alt="Back"
              className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full btnh2 afr ${isDarkMode ? "bg-gray-400" : "bg-transparent"}`}
            />
          </button>

          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 pt-8 afu">
            <p className="text-2xl sm:text-3xl lg:text-4xl text-[#EEEEEE]">
              We want to remember you forever 🤞
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#EEEEEE] font-semibold">
              Do tell us your <span className="text-red-500">phone number</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 mt-2">
              Your Phone number will NOT be made public
            </p>

            <div className="w-full flex flex-col justify-center items-center pt-4 gap-8">
              <PhoneInput
                defaultCountry="in"
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  setUserData({ ...userData, contact_details: val });
                }}
                className="flex items-center justify-center max-w-full"
                style={{
                  "--react-international-phone-height": "40px",
                  "--react-international-phone-background-color": "#111827",
                  "--react-international-phone-text-color": "#EEEEEE",
                  "--react-international-phone-border-color": "#FFFFFF",
                  "--react-international-phone-border-radius": "12px",
                  "--react-international-phone-country-selector-background-color": "#111827",
                  "--react-international-phone-country-selector-background-color-hover": "#1F2937",
                  "--react-international-phone-country-selector-arrow-color": "#EEEEEE",
                  "--react-international-phone-country-selector-arrow-size": "5px",
                  "--react-international-phone-dropdown-item-background-color": "#111827",
                  "--react-international-phone-dropdown-item-text-color": "#EEEEEE",
                  "--react-international-phone-dropdown-item-dial-code-color": "#9CA3AF",
                  "--react-international-phone-dropdown-item-height": "36px",
                  "--react-international-phone-dropdown-item-font-size": "14px",
                  "--react-international-phone-selected-dropdown-item-background-color": "#374151",
                  "--react-international-phone-selected-dropdown-item-text-color": "#FFFFFF",
                  "--react-international-phone-selected-dropdown-item-dial-code-color": "#76ABAE",
                  "--react-international-phone-dropdown-shadow": "0 12px 28px rgba(0, 0, 0, 0.55)",
                  "--react-international-phone-dropdown-top": "46px",
                }}
                inputStyle={{
                  width: "200px",
                  height: "40px",
                  fontSize: "16px",
                  borderWidth: "2px",
                  borderColor: "white",
                  borderRadius: "12px",
                  backgroundColor: "#111827",
                  color: "white",
                  padding: "0 12px",
                }}
                countrySelectorStyleProps={{
                  buttonStyle: {
                    height: "40px",
                    borderWidth: "2px",
                    borderColor: "white",
                    borderRadius: "12px",
                    backgroundColor: "#111827",
                    padding: "0 10px",
                    marginRight: "8px",
                  },
                  flagStyle: {
                    width: "22px",
                    height: "16px",
                  },
                  dropdownStyleProps: {
                    style: {
                      backgroundColor: "#111827",
                      color: "#EEEEEE",
                      border: "1px solid #4B5563",
                      borderRadius: "12px",
                      padding: "6px 0",
                      textAlign: "left",
                      zIndex: 50,
                    },
                    listItemFlagStyle: {
                      width: "22px",
                      height: "16px",
                      flexShrink: 0,
                    },
                  },
                }}
              />

              <button
                onClick={() => {
                  if (/^\+[1-9]\d{6,14}$/.test(phone)) {
                    setHid(4);
                  } else {
                    setHid(3);
                    toast("Enter a valid phone number with country code", { theme: "dark", autoClose: 3000 });
                  }
                }}
                className="flex items-center justify-center border-2 border-[#EEEEEE] bg-transparent text-[#EEEEEE] px-8 py-3 text-base leading-none text-center rounded-3xl btnh border-dashed cursor-pointer"
              >
                Continue
              </button>
            </div>

            <img src={phoneimg} alt="phone" className="h-20 w-20 sm:h-28 sm:w-28 mt-2 self-start opacity-90" />
          </div>
        </div>

        {/* Page 4 – Personal Email */}
        <div
          className={
            hid == 4
              ? "min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 py-16 relative border-b-2 border-gray-700 bg-pagebg text-center"
              : "hidden"
          }
        >
          <button
            onClick={() => setHid(3)}
            aria-label="Back to Phone"
            className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20"
          >
            <img
              src={Bbtn}
              alt="Back"
              className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full btnh2 afr ${isDarkMode ? "bg-gray-400" : "bg-transparent"}`}
            />
          </button>

          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 pt-8 afd">
            <h1 className="text-2xl sm:text-4xl text-[#EEEEEE] font-semibold leading-snug">
              And your <span className="text-red-500 text-3xl sm:text-5xl mx-1">Personal</span> email ?
            </h1>

            <input
              type="email"
              placeholder="Personal Email ID*"
              name="personal_email_id"
              value={userData.personal_email_id}
              className="w-full max-w-xs px-4 py-2 text-base text-center border-2 border-white rounded-xl bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-[#76ABAE] transition-colors"
              onChange={(e) => {
                setEmailId(e.target.value);
                setUserData({ ...userData, [e.target.name]: e.target.value });
              }}
            />

            <button
              onClick={() => {
                const cleanEmail = (EmailId || userData.personal_email_id || "").trim();
                if (!cleanEmail) {
                  HandleEmpty("");
                  return;
                }
                if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(cleanEmail)) {
                  toast("Enter a valid personal email address", { theme: "dark", autoClose: 3000 });
                  return;
                }
                setEmailId(cleanEmail);
                setUserData({ ...userData, personal_email_id: cleanEmail });
                setHid(5);
              }}
              className="border-2 border-[#EEEEEE] bg-transparent text-[#EEEEEE] flex items-center justify-center px-8 py-3 text-base leading-none text-center rounded-3xl btnh border-dashed cursor-pointer"
            >
              Continue
            </button>

            <img src={emailimg} alt="email" className="h-20 w-20 sm:h-28 sm:w-28 mt-2 opacity-90" />
          </div>
        </div>

        {/* Page 5 – Profile Photo */}
        <div
          className={
            hid == 5
              ? "min-h-screen w-full flex flex-col justify-center items-center bg-pagebg text-white px-4 sm:px-8 pt-20 pb-12 relative overflow-x-hidden"
              : "hidden"
          }
        >
          <button
            onClick={() => setHid(4)}
            aria-label="Back to Personal Email"
            className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20 hover:scale-105 transition-transform"
          >
            <img
              src={Bbtn}
              alt="Back"
              className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full ${isDarkMode ? "bg-gray-400" : ""}`}
            />
          </button>

          <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                We wanna
                <span className="text-red-500 px-3 animate-pulse">SEE</span>
                you! please?
              </h1>
              <p className="text-lg md:text-2xl text-gray-400 font-light italic">
                (we assure you, we are not creepy) 🙂
              </p>
            </div>

            <div className="relative flex flex-col items-center">
              <img
                src={arrow}
                alt="arrow"
                className="hidden lg:block absolute -left-32 top-1/2 -translate-y-1/2 w-32 h-24 filter invert opacity-50 -rotate-12"
              />

              <div className="relative group">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-dashed border-gray-500 overflow-hidden flex justify-center items-center bg-[#393E46] transition-all group-hover:border-blue-500">
                  <img src={preview || profilepic} alt="preview" className="w-full h-full object-cover" />
                </div>

                <label className="mt-6 flex flex-col items-center cursor-pointer group">
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg">
                    Choose profile photo
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">
                Image will be uploaded on final submit
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => {
                if (profileImage) {
                  setHid(6);
                } else {
                  toast("Please select a profile picture", { theme: "dark", autoClose: 3000 });
                }
              }}
              className="bg-white text-black px-12 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all active:scale-95 shadow-xl cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Page 6 – Extra Details + FINAL SUBMIT */}
        <div
          className={
            hid == 6
              ? "min-h-screen w-full relative flex flex-col justify-center border-b-2 border-gray-700 bg-pagebg text-[#EEEEEE] px-4 sm:px-8 lg:px-12 pt-20 pb-14"
              : "hidden"
          }
        >
          <button
            onClick={() => setHid(5)}
            aria-label="Back to Profile Photo"
            className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20"
          >
            <img
              src={Bbtn}
              alt="Back"
              className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full btnh2 afr ${isDarkMode ? "bg-gray-400" : ""}`}
            />
          </button>

          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
              <h1 className="text-2xl sm:text-4xl font-semibold">
                Maybe, also fill these as well ?
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-gray-300">
                (Our design team was out on vacation at this, so we couldn&apos;t create individual pages for this) 😅
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-stretch">
              {/* Left panel: Contact & Work */}
              <div className="lg:col-span-5 bg-[#111827]/70 border border-gray-700 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4">
                <h2 className="text-base sm:text-lg font-semibold text-[#76ABAE] tracking-wide">
                  Contact &amp; Current Role
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">
                    Alternate Contact Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={EXTRA_FIELD_CLASS}
                    placeholder="e.g. +91 9876543210"
                    name="alternate_contact_details"
                    value={userData.alternate_contact_details}
                    onChange={(e) => {
                      setalternate_contact_details(e.target.value);
                      setUserData({ ...userData, [e.target.name]: e.target.value });
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={EXTRA_FIELD_CLASS}
                    placeholder="City, State"
                    name="address"
                    value={userData.address}
                    onChange={(e) => {
                      setUserData({ ...userData, [e.target.name]: e.target.value });
                      setaddress(e.target.value);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-gray-300">
                      Current Company
                    </label>
                    <input
                      type="text"
                      className={EXTRA_FIELD_CLASS}
                      placeholder="Optional"
                      name="current_company"
                      value={userData.current_company}
                      onChange={(e) => {
                        setUserData({ ...userData, [e.target.name]: e.target.value });
                        setcurrent_company(e.target.value);
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-gray-300">
                      Designation
                    </label>
                    <input
                      type="text"
                      className={EXTRA_FIELD_CLASS}
                      placeholder="Optional"
                      name="designation"
                      value={userData.designation}
                      onChange={(e) => {
                        setUserData({ ...userData, [e.target.name]: e.target.value });
                        setdesignation(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right panel: Yearbook Story */}
              <div className="lg:col-span-7 bg-[#111827]/70 border border-gray-700 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-[#76ABAE] tracking-wide">
                    Your Yearbook Story
                  </h2>
                  <span className="text-xs text-gray-300">
                    About: {(userData.about || "").length}/300
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-300">
                    About Me (up to 300 characters) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    onInput={handleInputChange}
                    maxLength={300}
                    rows={3}
                    className={`${EXTRA_FIELD_CLASS} leading-relaxed resize-y`}
                    placeholder="Share a quick intro or favorite memory..."
                    name="about"
                    value={userData.about}
                    onChange={(e) => {
                      setUserData({ ...userData, [e.target.name]: e.target.value });
                      setabout(e.target.value);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-gray-300">
                      What will you miss most after graduating? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className={`${EXTRA_FIELD_CLASS} leading-relaxed resize-y`}
                      placeholder="Write your answer..."
                      name="question_1"
                      value={userData.question_1}
                      onChange={(e) => {
                        setUserData({ ...userData, [e.target.name]: e.target.value });
                        setquestion_1(e.target.value);
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-medium text-gray-300">
                      One change you&apos;d implement in college? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className={`${EXTRA_FIELD_CLASS} leading-relaxed resize-y`}
                      placeholder="Write your answer..."
                      name="question_2"
                      value={userData.question_2}
                      onChange={(e) => {
                        setUserData({ ...userData, [e.target.name]: e.target.value });
                        setquestion_2(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT – creates pending profile, then redirects to Phone/Email OTP verification */}
            <div className="w-full flex justify-center lg:justify-end pt-7">
              <button
                disabled={state}
                onClick={() => {
                  if (
                    alternate_contact_details === "" ||
                    address === "" ||
                    about === "" ||
                    question_1 === "" ||
                    question_2 === ""
                  ) {
                    HandleEmpty("");
                  } else if (about.trim().length > 300) {
                    toast("About section must be 300 characters or fewer.", {
                      theme: "dark",
                      autoClose: 3000,
                    });
                  } else {
                    onSubmit();
                  }
                }}
                className="border-2 border-[#EEEEEE] bg-transparent text-[#EEEEEE] px-10 py-3 flex items-center justify-center text-base font-medium rounded-3xl btnh border-dashed cursor-pointer disabled:opacity-50"
              >
                {state ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

      </div>
      <ToastContainer />
    </>
  );
}

export default Fill3;
