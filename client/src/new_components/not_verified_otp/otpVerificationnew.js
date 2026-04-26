import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../../helpers/Context";
import { useContext } from "react";
import phoneimg from "./th.png";
import "./filldetails.module.css";
import Abtn from "./arrowBtn.png";
import { PhoneInput } from "react-international-phone";
import jwt_decode from "jwt-decode";
import { useNavigate, Link, useParams } from "react-router-dom";

// ─── EDITABLE REDIRECT URL ────────────────────────────────────────────────────
const REDIRECT_URL = "https://yearbook.iiti.ac.in";
// ──────────────────────────────────────────────────────────────────────────────

function Fill1(props) {
  const {
    loading,
    setLoading,
    userData,
    setUserData,
    loggedin,
    setLoggedin,
    profile,
    setProfile,
    setFill,
    setVerified,
    setProfileIcon,
    isStudent,
  } = useContext(LoginContext);

  let user;
  if (window.localStorage.getItem("token") !== null) {
    user = jwt_decode(window.localStorage.getItem("token"));
  }

  const jti = useParams();

  useEffect(() => {
    if (!loading) {
      if (!loggedin) {
        window.location.href = "/login";
      }
      if (isStudent || user.jti !== jti.userId) {
        window.location.href = "/error";
      }
    }
  });

  const [message, setMessage] = useState("");
  const [state, setState] = useState(false);
  const [hid, setHid] = useState(1);
  const [EmailId, setEmailId] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const HandleEmpty = (e) => {
    if (e === "") {
      toast("Please fill all the details !", { theme: "dark", autoClose: 3000 });
    }
  };

  // ─── SUBMIT: save directly, mark verified=true, redirect ──────────────────
  const onSubmit = () => {
    setState(true);

    axios
      .post(process.env.REACT_APP_API_URL + "/userDataNew", {
        email: user.email,
        personal_email_id: userData.personal_email_id,
        contact_details: userData.contact_details,
        // Skip OTP/email — mark both verification steps as done
        one_step_verified: true,
        two_step_verified: true,
      })
      .then(() => {
        setFill(true);
        setVerified && setVerified(true);
        toast.success("Details saved! Redirecting...", { autoClose: 1500 });
        setTimeout(() => {
          window.location.href = REDIRECT_URL;
        }, 1600);
      })
      .catch((err) => {
        setState(false);
        toast.error("Something went wrong. Please try again.", { theme: "dark", autoClose: 3000 });
      });
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="h-fit w-screen">

        {/* Page 1 – Phone */}
        <div
          className={
            hid == 1
              ? "h-screen w-screen bg-[#222831] text-white flex justify-center items-center text-1xl relative border-b-2 fadeInRight"
              : "hidden"
          }
        >
          <div className="h-12 top-[30px] sm:top-30 absolute md:text-3xl md:top-40 lg:text-4xl lg:top-48 flex justify-center items-center tmp afu">
            We want to remember you forever 🤞
          </div>

          <div className="h-10 top-[60px] sm:top-56 absolute md:text-3xl md:top-64 lg:mt-2 lg:text-4xl flex justify-center items-center tmp afu">
            Do tell us your <span className="text-red-600 ml-4">phone number</span>
          </div>

          <div className="w-full flex justify-center items-center mt-7 md:mt-40 afu">
            <PhoneInput
              style={{ padding: "0px", fontSize: "25px", border: "0px solid black", width: "80px" }}
              defaultCountry="in"
              value={phone}
              onChange={(phone) => {
                setPhone(phone);
                setUserData({ ...userData, ["contact_details"]: phone });
              }}
              className="border-2 rounded-xl border-black p-2 w-full flex justify-center items-center"
              inputStyle={{
                width: "200px", height: "40px", fontSize: "23px",
                borderWidth: "0px", backgroundColor: "#d3d3d3",
              }}
              countrySelectorStyleProps={{
                style: { borderWidth: "0px", height: "35px" },
              }}
            />
          </div>

          <button
            onClick={() => {
              if (phone.length > 4) {
                setHid(2);
              } else {
                setHid(1);
                toast("Make sure you entered all digits !", { theme: "dark", autoClose: 3000 });
              }
            }}
            className="h-8 w-32 flex items-center justify-center border-2 border-black bg-white text-black bottom-[80px] absolute p-0 text-base leading-none text-center rounded-3xl md:top-96 md:mt-32 md:w-32 md:h-10 lg:mt-[12rem] btnh border-dashed afu"
          >
            Continue
          </button>

          <div className="absolute bottom-4 left-4 lg:bottom-16 lg:left-8 afu">
            <img
              src={phoneimg}
              alt="phone"
              className="hidden sm:block h-[90px] w-[90px] lg:h-40 lg:w-40 filter invert"
            />
          </div>
        </div>

        {/* Page 2 – Personal Email + FINAL SUBMIT */}
        <div
          className={
            hid == 2
              ? "h-screen w-screen bg-[#222831] text-white flex justify-center items-center text-1xl relative border-b-2"
              : "hidden"
          }
        >
          <div className="h-12 w-full top-[80px] left-4 absolute text-[20px] md:text-3xl md:top-40 lg:text-4xl xl:text-3xl lg:top-48 flex justify-center items-center tmp afd">
            And your{" "}
            <span className="text-red-600 ml-2 mr-2 text-[20px] md:text-5xl"> Personal </span>{" "}
            email ?
          </div>

          <div className="h-14 w-48 lg:h-14 lg:w-72 absolute top-[150px] lg:top-80 mt-0 flex justify-center items-center flex-row md:mt-4 lg:mt-0 lg:text-xl afd">
            <input
              type="text"
              placeholder="Personal Email ID*"
              name="personal_email_id"
              value={userData.personal_email_id}
              className="h-[32px] w-[200px] lg:h-10 lg:w-64 lg:mt-12 border-2 text-black border-black rounded-2xl text-center"
              onChange={(e) => {
                setEmailId(e.target.value);
                setUserData({ ...userData, [e.target.name]: e.target.value });
              }}
            />
          </div>

          {/* Submit directly – no OTP step */}
          <button
            disabled={state}
            onClick={() => {
              HandleEmpty(EmailId);
              if (EmailId != "") {
                onSubmit();
              }
            }}
            className="border-2 border-black bg-white text-black h-8 w-32 mt-60 flex items-center justify-center bottom-[100px] lg:bottom-60 absolute lg:top-[400px] p-0 text-base leading-none text-center rounded-3xl md:top-96 md:mt-32 md:w-32 md:h-10 lg:mt-16 btnh border-dashed afd disabled:opacity-50"
          >
            {state ? "Saving..." : "Submit"}
          </button>

          <button onClick={() => setHid(1)}>
            <img
              src={Abtn}
              className="hidden sm:block h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr filter invert"
            />
          </button>
        </div>

      </div>
      <ToastContainer />
    </>
  );
}

export default Fill1;
