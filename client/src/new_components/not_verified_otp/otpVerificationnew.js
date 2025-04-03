import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
// import "./otpVerificationnew.scss";
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
  const [imageSelected, setImageSelected] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [verify, setVerify] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [upload, setUploaded] = useState(false);
  const [verify2, setVeriify2] = useState(false);
  const [state, setState] = useState(false);
  const [otp, setOtp] = useState("");
  const [Otp1, setOtp1] = useState("");
  const [rollNoisNumber, setRollNoisNumber] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [sub, setSub] = useState(false);
  const [wait, setWait] = useState(false);

  const auth = getAuth();
  const [hid, setHid] = useState(1);
  const [isValid, setIsValid] = useState(true);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(1);
  const [EmailId, setEmailId] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const HandleEmpty = (e) => {
    //for handling empty text
    if (e === "") {
      toast("Please fill all the details !", {
        theme: "dark",
        autoClose: 3000,
      });
    }
  };

  const sendOTP = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/userDataNew", {
        email: user.email,
        personal_email_id: userData.personal_email_id,
        contact_details: userData.contact_details,
      })
      .then((res) => {
        setMessage("Sent an OTP to your contact number.");

        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container2",
          {
            size: "invisible",
            callback: (response) => {},
          },
          auth
        );

        const phoneNumber = userData.contact_details;
        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setSentOtp(true);
            setSub(true);
          })
          .catch((error) => {
            setMessage("Please enter your mobile number with +91");
          });
      })
      .catch((err) => {});
  };

  const onSubmit = () => {
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 6000);
    sendOTP();
  };

  const otpVerify = (e) => {
    // e.preventDefault();
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 20000);

    const code = otp;

    window.confirmationResult
      .confirm(code)
      .then((result) => {
        axios
          .post(process.env.REACT_APP_API_URL + "/verify", {
            userId: user.email,
          })
          .then((res) => {
            if (
              res.data.message ===
              "Sent a verification email to your personal email_id"
            ) {
              setHid(4);
              setFill(true);

              setSentOtp(false);
            }
            setMessage(res.data.message);
          })
          .catch((err) => {});
      })
      .catch((error) => {
        setMessage("Incorrect OTP");
        setHid(3);
        toast.warn("Incorrect OTP", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      });
  };

  const resendMail = () => {
    setMinutes(0);
    setSeconds(30);
    // setLink(`/emailverification/${user.jti}`);
        axios
          .post(process.env.REACT_APP_API_URL + "/verify", {
            userId: user.email,
          })
          .then((res) => {
            if (
              res.data.message ===
              "Sent a verification email to your personal email_id"
            ) {
              // setHid(8);
              // setFill(true);
              // setSentOtp(false);
            }
            setMessage(res.data.message);
          })
          .catch((err) => {});
  };

  return (
    <>
      <div class=" h-fit w-screen ">
        {/* first page */}

        {/* secound page */}

        {/* third page */}

        <div
          class={
            hid == 1
              ? " h-screen w-screen bg-[#222831] text-white  flex justify-center items-center text-1xl relative  border-b-2  fadeInRight "
              : "hidden"
          }
        >
          <div class="h-12 top-[30px] sm:top-30  absolute  md:text-3xl md:top-40  lg:text-4xl lg:top-48 flex justify-center items-center tmp afu ">
            {" "}
            We want to remember you forever 🤞{" "}
          </div>

          <div class=" h-10 top-[60px] sm:top-56 absolute md:text-3xl md:top-64 lg:mt-2 lg:text-4xl flex justify-center items-center tmp afu">
            {" "}
            Do tell us your <span class="text-red-600 ml-4">
              phone number
            </span>{" "}
          </div>

          <div class=" w-full flex justify-center items-center mt-7 md:mt-40  afu">
            <PhoneInput
              style={{
                padding: "0px",
                fontSize: "25px",
                border: "0px solid black",
                width: "80px",
              }}
              defaultCountry="in"
              value={phone}
              onChange={(phone) => {
                setPhone(phone);
                setUserData({ ...userData, ["contact_details"]: phone });
              }}
              className="border-2 rounded-xl border-black p-2 w-full flex justify-center items-center
                "
              inputStyle={{
                width: "200px",
                height: "40px",
                fontSize: "23px",
                borderWidth: "0px",
                backgroundColor: "#d3d3d3",
              }}
              countrySelectorStyleProps={{
                style: { borderWidth: "0px", height: "35px" },
              }}
            />
          </div>

          <div class="h-64 flex justify-center items-center flex-row ml-7 md:mt-32 afu absolute">
            {/* <div>
              <input
                type="text"
                class=" h-[41px] w-[200px] lg:h-10 lg:w-64 mt-12 border-2 border-black text-black rounded-2xl text-center"
                placeholder="Contact Number*"
                name="contact_details"
                value={userData.contact_details}
                onChange={(e) => {
                  // HandleEmptyNo(e);
                  setUserData({ ...userData, [e.target.name]: e.target.value });
                }}
              ></input>
            </div> */}
          </div>

          <button
            onClick={() => {
              if (phone.length > 4) {
                setHid(2);
              } else {
                setHid(1);
                toast("Make sure you entered all digits !", {
                  theme: "dark",
                  autoClose: 3000,
                });
              }
            }}
            class="h-8 w-32 flex items-center justify-center border-2 border-black bg-white text-black bottom-[80px] absolute p-0 text-base leading-none text-center  rounded-3xl md:top-96 md:mt-32 md:w-32 md:h-10  lg:mt-[12rem] btnh border-dashed afu "
          >
            {" "}
            Continue{" "}
          </button>

          <div class=" absolute bottom-4 left-4 lg:bottom-16 lg:left-8 afu">
            <img
              src={phoneimg}
              alt="phone"
              class="hidden sm:block h-[90px] w-[90px] lg:h-40 lg:w-40 filter invert"
            />
          </div>

          {/* <button onClick={() => {
            setHid(1);
          }} > <img src={Abtn} class=" h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr" /> </button> */}
        </div>

        {/* fifth page */}

        <div
          class={
            hid == 2
              ? " h-screen w-screen  bg-[#222831] text-white flex justify-center items-center text-1xl relative  border-b-2"
              : "hidden"
          }
        >
          <div class="h-12 w-full top-[80px] left-4 absolute text-[20px]  md:text-3xl md:top-40 lg:text-4xl xl:text-3xl lg:top-48 flex justify-center items-center tmp afd">
            {" "}
            And your{" "}
            <span class="text-red-600 ml-2 mr-2 text-[20px] md:text-5xl"> Personal </span>{" "}
            email ?{" "}
          </div>

          <div class="h-14 w-48 lg:h-14 lg:w-72 absolute top-[150px] lg:top-80 mt-0 flex justify-center items-center flex-row md:mt-4 lg:mt-0 lg:text-xl afd">
            <input
              type="text"
              placeholder="Personal Email ID*"
              name="personal_email_id"
              value={userData.personal_email_id}
              class="h-[32px] w-[200px] lg:h-10 lg:w-64 lg:mt-12 border-2 text-black border-black rounded-2xl text-center"
              onChange={(e) => {
                setEmailId(e.target.value);
                setUserData({ ...userData, [e.target.name]: e.target.value });
              }}
            ></input>
          </div>
          <div id="recaptcha-container2"></div>

          <button
            onClick={() => {
              HandleEmpty(EmailId);
              if (EmailId != "") {
                setHid(3);
                onSubmit();
              } else {
                setHid(2);
              }
              // {EmailId != '' ? setHid(5): setHid(4)};
            }}
            class="border-2 border-black bg-white text-black h-8 w-32 mt-60 flex items-center justify-center bottom-[100px] lg:bottom-60 absolute lg:top-[400px] p-0 text-base leading-none text-center rounded-3xl md:top-96 md:mt-32 md:w-32 md:h-10 lg:mt-16 btnh border-dashed afd"
          >
            {" "}
            Continue{" "}
          </button>

          <button
            onClick={() => {
              setHid(1);
            }}
          >
            {" "}
            <img
              src={Abtn}
              class="hidden sm:block h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr filter invert"
            />{" "}
          </button>
        </div>

        {/* seventh page */}

        {/* eight page */}

        {/* fourth page */}

        <div
          class={
            hid == 3
              ? " h-screen w-screen bg-[#222831] text-white flex justify-center items-center  relative  border-b-2 "
              : "hidden"
          }
        >
          <div class="h-12 w-full top-[40px] left-4 absolute text-[18px]  md:text-3xl md:top-40 lg:text-[34px] xl:text-4xl lg:top-48 flex justify-center items-center tmp asr ">
            {" "}
            Don't take it personally "Corporate" wants to verify your phone
            number{" "}
          </div>

          <div class=" h-10 w-full top-[180px] text-[15px] left-0 absolute md:text-3xl md:top-64 md:w-100 md:left-14 lg:mt-0 lg:text-[18px] lg:left-12 flex justify-center asr">
            {" "}
            (Enter the OTP you recieved on your phone){" "}
          </div>

          <div class="h-14 w-48  absolute top-[150px] md:top-64 mt-10 flex justify-center items-center flex-row md:mt-4 lg:mt-10 lg:text-xl afu">
            <input
              type="text"
              class="h-[32px] w-[200px] lg:h-10 lg:w-64 lg:mt-12 border-2 border-black text-black rounded-2xl text-center"
              maxLength={6}
              onChange={(e) => {
                setOtp1(e.target.value);
                setOtp(e.target.value);
              }}
            ></input>
          </div>

          {/* <button
            // disabled={seconds > 0 || minutes > 0}
            // style={{
            //   color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#000000",
            // }}
            // onClick={() => {
            //   navigate(`/otpVerificationnew/${user.jti}`)
            // }}

            to = {`/otpVerificationnew/${user.jti}`}

            class="border-2 border-black flex items-center justify-center  h-8 w-32 bottom-36 left-10 absolute lg:left-[350px] p-0 text-base leading-none rounded-3xl md:top-96 md:mt-32   md:w-32 md:h-10  lg:mt-28  xl:left-[550px] afu"> Resend Otp </button>

          {/* <div class="flex bottom-16 left-6 absolute lg:left-[350px] md:bottom-2 md:mt-32  md:h-10  lg:mt-28  xl:left-[535px] xl:bottom-28 afu " >
            {seconds > 0 || minutes > 0 ? (
              <p>
                Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </p>
            ) : (
              <p>Didn't recieve code?</p>
            )}
          </div> */}

          <button
            onClick={(e) => {
              HandleEmpty(Otp1);
              if (Otp1 !== "") {
                otpVerify();
              }

              // { verify == true ? setHid(4) : setHid(3) };
            }}
            class="h-8 w-32 flex items-center justify-center border-2 border-black bg-white text-black bottom-[80px] sm:bottom-36 absolute p-0 text-base leading-none text-center  rounded-3xl md:top-96 md:mt-32   md:w-32 md:h-10  lg:mt-36 btnh border-dashed afu"
          >
            {" "}
            Continue{" "}
          </button>
          {/* 
          <button onClick={() => {
            setHid(2);
          }} > <img src={Abtn} class=" h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr" /> </button> */}
        </div>
        {/* sixth page */}

        <div
          class={
            hid == 4
              ? " h-screen w-screen bg-[#222831] text-white flex justify-center items-center text-1xl relative  border-b-2 "
              : "hidden"
          }
        >
          <div class="h-12 w-full top-44 left-4 absolute text-4xl  md:text-4xl md:top-40 lg:text-4xl xl:text-5xl lg:top-48 flex justify-center items-center tmp atd ">
            Check your inbox.{" "}
          </div>

          <div class="h-12 w-full top-56 left-4 absolute text-2xl  md:text-[20px] md:top-52 lg:text-[22px] lg:top-64 flex justify-center items-center tmp afu">
            (Check spam folder as well and close this window){" "}
          </div>

          {/* 
          <button onClick={() => {
            setHid(3);
          }} > <img src={Abtn} class=" h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr" /> </button> */}

          
            <button
              onClick={() => {
                resendMail();
              }}
              class="border-2 px-6 py-1  border-black bg-white text-black btnh border-dashed rounded-3xl afu md:mt-16 lg:mt-40 text-[1.3rem] "
            >
              Resend Mail
            </button>
          
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default Fill1;
