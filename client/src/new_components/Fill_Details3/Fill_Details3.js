import React, { useState, useEffect } from "react";
import profilepic from "./profile.jpeg";
import arrow from "./arrow.png";
import "./filldetails.module.css";
import phoneimg from "./telephone-call.png";
// import Abtn from "./arrowBtn.png";
import Abtn from "./image.png";
import Bbtn from "./back-arrow.png";
import emailimg from "./email.png";
import grad from "./graduated.png";

//for notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { LoginContext } from "../../helpers/Context";
import { useContext } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";

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
  let user;
  if (window.localStorage.getItem("token") !== null) {
    user = jwt_decode(window.localStorage.getItem("token"));
  }

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

  const [message, setMessage] = useState("");
  const [imageSelected, setImageSelected] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSelected, setisSelected] = useState(false);
  const [verify, setVerify] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [upload, setUploaded] = useState(false);
  const [verify2, setVeriify2] = useState(false);
  const [state, setState] = useState(false);
  const [state1, setState1] = useState(false);
  const [otp, setOtp] = useState("");
  const [rollNoisNumber, setRollNoisNumber] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [sub, setSub] = useState(false);
  const [wait, setWait] = useState(false);

  const [hid, setHid] = useState(1);

  const [Name, setName] = useState("");
  const [RollNo, setRollNo] = useState("");
  const [AcadP, setAcadP] = useState("");
  const [Deprt, setDeprt] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [Otp1, setOtp1] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [Otp2, setOtp2] = useState("");
  const [alternate_contact_details, setalternate_contact_details] =
    useState("");
  const [address, setaddress] = useState("");
  const [current_company, setcurrent_company] = useState("");
  const [designation, setdesignation] = useState("");
  const [about, setabout] = useState("");
  const [question_2, setquestion_2] = useState("");
  const [question_1, setquestion_1] = useState("");

  const [isValid, setIsValid] = useState(true);
  const [isValidR, setIsValidR] = useState(true);

  const [phone, setPhone] = useState("");
  const [linkOTP, setLinkOTP] = useState(`/`);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   return storedThemeMode === "dark";
  // });

  const auth = getAuth();

  const onSubmit = () => {
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 6000);
    axios
      .post(process.env.REACT_APP_API_URL + "/userData", {
        email: user.email,
        name: userData.name,
        roll_no: userData.roll_no,
        academic_program: userData.academic_program,
        department: userData.department,
        personal_email_id: userData.personal_email_id,
        contact_details: userData.contact_details,
        alternate_contact_details: userData.alternate_contact_details,
        address: userData.address,
        current_company: userData.current_company,
        designation: userData.designation,
        about: userData.about,
        profile_img: imageUrl,
        question_1: userData.question_1,
        question_2: userData.question_2,
      })
      .then((res) => {
        // if (res.data.message === "Roll No. should be in Digits") {
        if (res.data.message !== "Sent an OTP to your contact number.") {
          setMessage(res.data.message);
          const timetochangemsg = setTimeout(() => {
            setMessage("");
          }, 1500); // delay execution by 2 second

          return () => clearTimeout(timetochangemsg);
        }

        if (res.data.message === "Sent an OTP to your contact number.") {
          setMessage(res.data.message);

          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
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

          // setTimeout(()=>{
          //   setMessage("")
          // },15000)
        }
      })
      .catch((err) => {});
  };

  const otpVerify = () => {
    // e.preventDefault();

    setState(true);
    setTimeout(() => {
      setState(false);
    }, 20000);

    const code = otp;

    window.confirmationResult
      .confirm(code)
      .then((result) => {
        setVerify(true);
        axios
          .post(process.env.REACT_APP_API_URL + "/verify", {
            userId: user.email,
          })
          .then((res) => {
            if (
              res.data.message ===
              "Sent a verification email to your personal email_id"
            ) {
              setHid(8);
              setFill(true);
              setSentOtp(false);
            }
            setMessage(res.data.message);
          })
          .catch((err) => {});
      })
      .catch((error) => {
        setMessage("Incorrect OTP");
        setHid(7);
        toast.warn("Incorrect OTP", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      });

    window.recaptchaVerifier.render();
  };

  const resendOTP = () => {
    setMinutes(0);
    setSeconds(30);

    const phoneNumber = userData.contact_details;

    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(
      window.recaptchaVerifier.auth,
      phoneNumber,
      appVerifier
    )
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setSentOtp(true);
        setSub(true);
      })
      .catch((error) => {
        setMessage("Please enter your mobile number with +91");
      });
    // onSubmit()
    // setLinkOTP(`/otpVerificationnew/${user.jti}`);
  };

  const uploadImage = () => {
    setUploaded(true);

    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "profile_img");

    setWait(true);
    axios
      .post("https://api-eu.cloudinary.com/v1_1/dnqlvxfuc/upload", formData)
      .then((res) => {
        setWait(false);
        setImageUrl(res.data.url);
        setImageUploaded(true);
        setTimeout(() => {
          setImageUploaded(false);
        }, 10000);
      });
  };

  //  function for alerting on empty input

  const HandleEmpty = (e) => {
    //for handling empty text
    if (e === "") {
      toast("Please fill all the details !", {
        theme: "dark",
        autoClose: 3000,
      });
    }
  };
  const HandleROll = (e) => {
    toast("Roll Number can only be in Digits", {
      theme: "dark",
      autoClose: 3000,
    });
  };

  const HandleEmptyNo = (event) => {
    const isValidFormat = /^\d{10}$/.test(event.target.value);
    setIsValid(isValidFormat);
    setMobileNo(event.target.value);
  };

  const HandleDigitsOnly = (event) => {
    const containsOnlyDigits = /^\d+$/.test(event.target.value);
    setIsValidR(containsOnlyDigits);
    setRollNo(event.target.value);
  };

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(1);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(5);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const handleContinune = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 5000); // 5000 milliseconds = 3 seconds
  };

  return (
    <>
      <div class=" h-fit w-screen ">
        {/* first page */}

        <div
          class={
            hid == 1
              ? `h-screen w-screen flex justify-center text-2xl relative border-b-2 bg-[#222831]`
              : "hidden"
          }
        >
          <div class=" h-12 top-44 absolute text-[30px] md:text-5xl lg:text-6xl lg:top-60  flex justify-center afu text-[#EEEEEE]">
            {" "}
            Just To Verify Your Name Is ?
          </div>

          <div class=" h-10 top-72 absolute md:top-80 lg:mt-20  afu">
            <input
              type="text"
              placeholder="name"
              name="name"
              value={userData.name}
              class="text-center   p-0 m-0 border-2 rounded-[11px] border-white bg-transparent text-[#EEEEEE]"
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setName(e.target.value);
              }}
            ></input>{" "}
          </div>

          <button
            onClick={() => {
              setUserData({ ...userData, ["name"]: Name.trimEnd() });
              setName(Name.trimEnd());
              HandleEmpty(Name);
              {
                Name != "" ? setHid(2) : setHid(1);
              }         
              // console.log(userData.name);
            }}
            class={`border-2 border-white bg-transparent text-white flex justify-center items-center h-[35px] w-[130px] lg:h-10 lg:w-32 top-[26rem] absolute p-0 mb-1 text-base leading-none text-center afu  rounded-3xl md:top-96 md:mt-14   md:w-32 md:h-10  lg:mt-36 btnh border-dashed `}
          >
            {" "}
            Continue{" "}
          </button>
        </div>

        {/* secound page */}

        <div
          class={
            hid == 2
              ? "h-screen w-screen   flex justify-center text-1xl relative  border-b-2  bg-[#222831]"
              : "hidden"
          }
        >
          <div class="h-12 top-36 left-4 absolute text-2xl  md:text-3xl md:top-40 md:ml-20  lg:text-4xl lg:top-36 lg:left-44 afr text-[#EEEEEE] ">
            {" "}
            Right, of course we knew that 🙄
          </div>

          <div class=" h-10 top-48 left-12 absolute text-2xl md:text-3xl md:top-56 md:w-100 md:ml-40 lg:mt-0 lg:text-4xl lg:left-64 afr text-[#EEEEEE]">
            {" "}
            Verify your academic details to continue{" "}
          </div>

          <div class="h-52 w-full  absolute top-64 flex justify-center items-center flex-col md:flex-row md:mt-4 lg:mt-10 lg:text-xl afr">
            <div class="h-12 w-64 flex flex-col  md:w-56 lg:w-80 mt-1 mb-4 items-center afr">
              <h1 class=" text-base text-center lg:text-2xl text-[#EEEEEE]">
                Enrollment number
              </h1>

              <input
                type="text"
                maxLength={10}
                placeholder="Enter"
                name="roll_no"
                value={userData.roll_no}
                class="text-center   rounded-[9px] h-6 w-[210px] border-2 border-white bg-transparent mt-1 p-2 md:w-40 md:mt-4 lg:w-52 lg:mt-4 xl:h-7"
                onChange={(e) => {
                  setUserData({ ...userData, [e.target.name]: e.target.value });
                  setRollNo(e.target.value);
                  HandleDigitsOnly(e);
                }}
              ></input>
            </div>

            <div class="h-12 w-64 flex flex-col md:w-56 md:mt-0 lg:w-80 mt-3 lg:mt-0 mb-4 items-center ">
              <h1 class=" text-base text-center   lg:text-2xl text-[#EEEEEE]">
                Academic Program
              </h1>

              {/* <input type="text" class="text-center   rounded-[9px] h-6 w-[210px] border-2 border-black mt-1 p-2 md:w-40 lg:w-52 lg:mt-4 xl:h-7"></input> */}

              <select
                name="academic_program"
                defaultValue={userData.academic_program}
                class="text-center   rounded-[9px] text-[13.5px] h-7 lg:h-8 w-[210px] border-2 border-white bg-transparent text-[#EEEEEE] mt-1 p-1 md:w-40 lg:w-60 lg:mt-4 lg:text-[15px] xl:h-9 xl:text-[16px] md:mt-4 "
                onChange={(e) => {
                  setAcadP(e.target.value);
                  setUserData({ ...userData, [e.target.name]: e.target.value });
                }}
              >
                <option
                  value=""
                  name="Academic Program"
                  disabled=""
                  selected=""
                  class="selct bg-[#222831] "
                >
                  Academic Program
                </option>
                <option
                  value="Bachelor of Technology (BTech)"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
                  Bachelor of Technology (BTech)
                </option>
                <option
                  value="Master of Technology (MTech)"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
                  Master of Technology (MTech)
                </option>
                <option
                  value="Master of Science (MSc)"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
                  Master of Science (MSc)
                </option>
                <option
                  value="Five Year BTech + MTech"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
                  Five Year BTech + MTech
                </option>
                <option
                  value="MS (Research)"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
                  MS (Research)
                </option>
                <option
                  value="Doctor of Philosophy"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
                  Doctor of Philosophy
                </option>
                <option value="MS-DSM" name="academic_program" class="selct bg-[#222831]">
                  MS-DSM
                </option>
                onChange=
                {(e) => {
                  setAcadP(e.target.value);
                }}
              </select>
            </div>

            <div class="h-12 w-64 flex flex-col mt-4 md:w-56 md:mb-5 md:mt-0 lg:w-80 lg:mt-0 lg:mb-4 items-center">
              <h1 class=" text-base text-center   lg:text-2xl text-[#EEEEEE]">Department</h1>

              <select
                name="department"
                defaultValue={userData.department}
                class="text-center   rounded-[9px] text-[13.5px] h-7 lg:h-8 w-[210px] border-2 border-white bg-transparent text-[#EEEEEE] mt-1 p-1 md:w-40 lg:w-60 lg:mt-4 lg:text-[15px] xl:h-9 xl:text-[16px] md:mt-4"
                onChange={(e) => {
                  setDeprt(e.target.value);
                  setUserData({ ...userData, [e.target.name]: e.target.value });
                }}
              >
                <option
                  value=""
                  class="selct bg-[#222831]"
                  name="Department"
                  disabled=""
                  selected=""
                >
                  Department
                </option>
                <option
                  value="Computer Science and Engineering"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Computer Science and Engineering
                </option>
                <option
                  value="Electrical Engineering"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Electrical Engineering
                </option>
                <option
                  value="Mechanical Engineering"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Mechanical Engineering
                </option>
                <option
                  value="Civil Engineering"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Civil Engineering
                </option>
                <option
                  value="Metallurgy Engineering and Materials Science"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Metallurgy Engineering and Materials Science
                </option>
                <option
                  value="Astronomy, Astrophysics and Space Engineering"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Astronomy, Astrophysics and Space Engineering
                </option>
                <option
                  value="Biosciences and Biomedical Engineering"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Biosciences and Biomedical Engineering
                </option>
                <option value="Physics" name="department" class="selct bg-[#222831]">
                  Physics
                </option>
                <option value="Chemistry" name="department" class="selct bg-[#222831]">
                  Chemistry
                </option>
                <option value="Mathematics" name="department" class="selct bg-[#222831]">
                  Mathematics
                </option>
                <option
                  value="Humanities and Social Sciences"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Humanities and Social Sciences
                </option>
                <option
                  value="Electric Vehicle Technology"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Electric Vehicle Technology
                </option>
                <option value="MS-DSM" name="academic_program" class="selct bg-[#222831]">
                  MS-DSM
                </option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              // console.log(userData.name);
              // HandleEmpty(RollNo);
              // HandleEmpty(AcadP);
              // HandleEmpty(Deprt);
              {
                if (Deprt === "" || AcadP === "") {
                  setHid(2);
                  HandleEmpty("");
                } else {
                  if (isValidR) {
                    setHid(3);
                  } else {
                    HandleROll("");
                  }
                }
              }
            }}
            class="border-2 border-[#EEEEEE] bg-[#222831] text-[#EEEEEE] h-8 w-32 bottom-[6rem] flex justify-center items-center lg:bottom-20 absolute p-0 text-base leading-none text-center  rounded-3xl md:top-96 md:mt-32   md:w-32 md:h-10  lg:mt-36 btnh border-dashed afu "
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
              src={Bbtn}
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${
                isDarkMode ? "bg-gray-400" : "bg-[#222831]"
              }`}
            />{" "}
          </button>

          <div class=" afu w-full">
            <img
              src={grad}
              alt="phone"
              class="lg:h-32 lg:w-32 ml-[80rem] mt-[35rem]"
            />
          </div>
        </div>

        {/* third page */}

        <div
          class={
            hid == 3
              ? " h-screen w-screen flex flex-col justify-center items-center text-1xl  border-b-2  fadeInRight bg-[#222831]"
              : "hidden"
          }
        >
          <div class="h-12 text-[25px]  md:text-3xl  lg:text-4xl md:mt-32 flex justify-center items-center afu text-[#EEEEEE]">
            {" "}
            We want to remember you forever 🤞{" "}
          </div>

          <div class=" h-10 text-[25px]  md:text-3xl md:top-64 lg:mt-2 lg:text-4xl flex justify-center items-center afu text-[#EEEEEE]">
            {" "}
            Do tell us your <span class="text-red-600 ml-4">
              phone number
            </span>{" "}
          </div>

          <div class="flex w-full justify-center items-center h-10 mt-4 md:mt-14  text-[15px]  lg:text-[20px] lg:mt-16  afu text-[#EEEEEE]">
            {" "}
            Your Phone number will NOT be made public{" "}
          </div>

          <div class=" w-full flex flex-col justify-center items-center afu pt-8 mb-6">
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
              className="border-2 rounded-xl border-white p-2 w-full flex justify-center items-center pb-10
                "
              inputStyle={{
                width: "200px",
                height: "40px",
                fontSize: "23px",
                borderWidth: "2px",
                borderColor: "white",
                borderRadius: "13px",
                backgroundColor: "transparent",
                color: "white"
              }}
              countrySelectorStyleProps={{
                style: {
                  borderWidth: "2px",
                  height: "40px",
                  borderColor: "white",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                },
              }}
            />

            <button
              onClick={() => {
                if (phone.length > 4) {
                  setHid(4);
                } else {
                  setHid(3);
                  toast("Make sure you entered all digits !", {
                    theme: "dark",
                    autoClose: 3000,
                  });
                }
              }}
              class="h-8 w-32 flex items-center justify-center border-2 border-[#EEEEEE] bg-[#222831] text-[#EEEEEE] p-0 text-base leading-none text-center  rounded-3xl md:w-32 md:h-10  btnh border-dashed afu mt-14"
            >
              {" "}
              Continue{" "}
            </button>
          </div>

          <div class=" afu w-full">
            <img
              src={phoneimg}
              alt="phone"
              class=" h-[90px] w-[90px] lg:h-40 lg:w-40 ml-8"
            />
          </div>

          <button
            onClick={() => {
              setHid(2);
            }}
          >
            {" "}
            <img
              src={Bbtn}
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${
                isDarkMode ? "bg-gray-400" : "bg-[#222831]"
              }`}
            />{" "}
          </button>
        </div>

        {/* fifth page */}

        <div
          class={
            hid == 4
              ? " h-screen w-screen   flex justify-center items-center text-1xl relative border-b-2 bg-[#222831]"
              : "hidden"
          }
        >
          <div class="h-12 w-full top-44 left-4 absolute text-3xl  md:text-3xl md:top-40 lg:text-4xl xl:text-3xl lg:top-48 flex justify-center items-center afd text-[#EEEEEE]">
            {" "}
            And your{" "}
            <span class="text-red-600 ml-2 mr-2 text-5xl"> Personal </span>{" "}
            email ?{" "}
          </div>

          <div class="h-14 w-48 lg:h-14 lg:w-72 absolute top-[310px] lg:top-72 mt-0 flex justify-center items-center flex-row lg:mt-0 lg:text-xl afd">
            <input
              type="text"
              placeholder="Personal Email ID*"
              name="personal_email_id"
              value={userData.personal_email_id}
              class="h-[32px] w-[200px] lg:h-10 lg:w-[500px] lg:mt-12 border-2 border-white   rounded-2xl text-center bg-[#222831]"
              onChange={(e) => {
                setEmailId(e.target.value);
                setUserData({ ...userData, [e.target.name]: e.target.value });
              }}
            ></input>
          </div>

          <button
            onClick={() => {
              HandleEmpty(EmailId);
              {
                EmailId != "" ? setHid(5) : setHid(4);
              }
            }}
            class="border-2 border-[#EEEEEE] bg-[#222831] text-[#EEEEEE] h-8 w-32 mt-60 flex items-center justify-center lg:bottom-60 absolute lg:top-[400px] p-0 text-base leading-none text-center rounded-3xl md:top-96 md:mt-32 md:w-32 md:h-10 lg:mt-16 btnh border-dashed afd"
          >
            {" "}
            Continue{" "}
          </button>

          <button
            onClick={() => {
              setHid(3);
            }}
          >
            {" "}
            <img
              src={Bbtn}
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${
                isDarkMode ? "bg-gray-400" : "bg-[#222831]"
              }`}
            />{" "}
          </button>

          <div class=" afu w-full">
            <img
              src={emailimg}
              alt="phone"
              class=" h-[90px] w-[90px] lg:h-40 lg:w-40 ml-48"
            />
          </div>
        </div>

        {/* seventh page */}

        <div
          class={
            hid == 5
              ? " h-screen w-screen   flex justify-center items-center text-1xl relative  border-b-2 "
              : "hidden"
          }
        >
          <div class="h-12 w-full top-36 left-8 absolute text-3xl  md:text-3xl md:top-40 lg:text-[35px] xl:text-3xl lg:top-48 lg:left-28 xl:left-80 xl:top-48 abl">
            {" "}
            We wanna <span class="text-red-600 ml-2 mr-2 text-5xl">
              SEE{" "}
            </span>{" "}
            you! please?
          </div>

          <div class=" h-10 w-full top-[205px] left-8 absolute text-[18px] md:text-3xl md:top-64 md:w-100 md:left-14 lg:mt-0 lg:text-[24px] lg:left-32 xl:left-80 abl">
            {" "}
            (we assure you, we are not creepy) 🙂{" "}
          </div>

          <div class="w-[110px] h-[110px] md:w-60 md:h-60 border-2 border-gray-400 absolute right-2 top-64 md:right-28 md:top-20 rounded-full overflow-hidden flex justify-center items-center xl:top-30 xl:right-80 abl">
            <img src={imageUrl} class=" w-fit "></img>
          </div>

          <img
            src={arrow}
            class="w-[95px] h-[62px] top-[372px] right-[115px] md:w-48 md:h-32 lg:top-[18rem] lg:right-[22rem] absolute xl:right-[38rem] abl "
          ></img>

          <input
            type="file"
            onChange={(event) => {
              setImageSelected(event.target.files[0]);
              if (event.target.files[0] === "") {
                setisSelected(false);
              } else {
                setisSelected(true);
              }
            }}
            class="border-2 border-black h-9 w-60 bottom-12 left-[30px] top-[424px] absolute md:right-[430px]   leading-none text-center rounded-3xl md:mt-2 md:w-60 md:h-10 lg:top-96 lg:ml-6 xl:left-[270px] xl:top-[400px] btnh border-dashed p-[6px] px-10 afu"
          ></input>
          {/* <button onClick={() => {}} class="border-2 border-black h-9 w-32 bottom-12 left-[30px] top-[424px] md:bottom-36 absolute md:right-[322px]  p-0 text-base leading-none text-center  rounded-3xl md:top-96 md:mt-32   md:w-32 md:h-10  lg:mt-2 lg:left-40 xl:left-[420px] xl:top-[400px] btnh border-dashed afu"> Choose File </button> */}

          <button
            onClick={() => {
              if (isSelected) {
                {
                  uploadImage();
                }
              } else {
                toast("Make sure you selected the pic !", {
                  theme: "dark",
                  autoClose: 3000,
                });
              }
            }}
            class="border-2 border-black bg-white text-black h-9 w-32 bottom-12 top-[485px] md:bottom-36 absolute md:right-[322px]  p-0 text-base leading-none text-center  rounded-3xl md:top-96 md:mt-32   md:w-32 md:h-10  lg:mt-2 lg:left-80 xl:left-[580px] xl:top-[400px] btnh border-dashed afu"
          >
            {" "}
            Upload Photo{" "}
          </button>

          <div class="mt-52 md:mt-36 lg:mt-80 lg:mr-[450px] xl:mt-80 xl:mr-[350px]">
            {upload && (
              <h3 style={{ color: `${isDarkMode ? "white" : "black"}` }}>
                {wait && "Wait... while image is uploading"}
                {imageUploaded && "Image Uploaded"}
              </h3>
            )}
          </div>

          <button
            onClick={() => {
              if (upload) {
                setHid(6);
              } else {
                setHid(5);
                toast("Make sure you uploaded the pic !", {
                  theme: "dark",
                  autoClose: 3000,
                });
              }
            }}
            class="border-2 border-black bg-white text-black h-8 w-32 top-[555px]  flex items-center justify-center absolute lg:left-[443px] lg:top-[470px]  p-0 text-base leading-none text-center  rounded-3xl md:top-96 md:mt-44   md:w-32 md:h-10  lg:mt-16   xl:left-[710px] btnh border-dashed afd"
          >
            {" "}
            Continue{" "}
          </button>

          <button
            onClick={() => {
              setHid(4);
            }}
          >
            {" "}
            <img
              src={Abtn}
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${
                isDarkMode ? "bg-gray-400" : "bg-white"
              }`}
            />{" "}
          </button>
        </div>

        {/* eight page */}

        <div
          class={
            hid == 6
              ? " h-[218vh]  md:h-[105vh]  w-screen   flex flex-row md:justify-center md:items-center text-1xl relative  border-b-2  "
              : "hidden"
          }
        >
          <div class="h-12 w-full text-3xl top-[122px] left-[42px] md:left-4 absolute md:text-4xl md:top-28 lg:text-[42px] xl:text-4xl flex lg:left-[23rem] asr">
            {" "}
            Maybe, also fill these as well ?{" "}
          </div>

          <div class="h-10 w-full top-[166px] left-[17px] absolute md:text-3xl md:top-44 md:w-100 md:left-14 lg:mt-0 lg:text-[24px] lg:left-10 flex justify-center asr">
            {" "}
            (Our design team was out on vacation at this, so we couldn't create
            individual pages for this) 😅{" "}
          </div>

          {/* 1st col  */}

          <div class="h-14 w-54  absolute top-[280px] left-[77px] md:top-[260px] flex justify-center items-center flex-row lg:text-xl md:left-28 xl:left-60 af ">
            <input
              type="text"
              class=" font-bold h-[39px] w-[225px] md:h-10 md:w-[210px]  mt-0 border-2 border-black text-black  text-sm rounded-xl px-3"
              placeholder="Alternate Contact Number"
              name="alternate_contact_details"
              value={userData.alternate_contact_details}
              onChange={(e) => {
                setalternate_contact_details(e.target.value);
                setUserData({ ...userData, [e.target.name]: e.target.value });
              }}
            ></input>
          </div>

          <div class="h-14 w-54  absolute top-[360px] left-[77px] md:top-[320px]  flex justify-center items-center flex-row md:mt-4 lg:mt-0 lg:text-xl md:left-28 xl:left-60 af">
            <input
              type="text"
              class="font-bold h-[39px] w-[225px] md:h-10 md:w-[210px] mt-0 border-2 border-black text-black  text-sm rounded-xl px-3"
              placeholder="Address"
              name="address"
              value={userData.address}
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setaddress(e.target.value);
              }}
            ></input>
          </div>

          <div class="h-14 w-54  absolute top-[440px] left-[77px] md:top-[400px] flex justify-center items-center flex-row md:mt-0 lg:mt-0 lg:text-xl md:left-28 xl:left-60 af">
            <input
              type="text"
              class="font-bold h-[39px] w-[225px] md:h-10 md:w-[210px] mt-0 border-2 border-black text-black  text-sm rounded-xl px-3"
              placeholder="Current company (if any)"
              name="current_company"
              value={userData.current_company}
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setcurrent_company(e.target.value);
              }}
            ></input>
          </div>

          <div class="h-14 w-54  absolute top-[520px] left-[77px] md:top-[480px] flex justify-center items-center flex-row md:mt-4 lg:mt-0 lg:text-xl md:left-28 xl:left-60 af">
            <input
              type="text"
              class="font-bold h-[39px] w-[225px] md:h-10 md:w-[210px] mt-0 border-2 border-black text-black  text-sm rounded-xl px-3"
              placeholder="Designation (if any)"
              name="designation"
              value={userData.designation}
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setdesignation(e.target.value);
              }}
            ></input>
          </div>

          {/* 2nd col */}

          <div class=" h-48 w-36 md:h-80 w-70 absolute top-[600px] left-[60px] md:top-[220px] mt-12 md:mt-8 lg:mt-[10rem] lg:text-xl md:left-[400px] xl:left-[570px] xl:top-[215px] xl:mt-0 af">
            <textarea
              type="text"
              class="rounded-xl bg-white text-black font-bold  h-[17rem] w-[16rem] md:h-80 max-h-[17rem] md:w-[270px] lg:mt-[-8rem] xl:mt-12 border-2 border-black   text-base text-start p-2"
              placeholder="    About Me (50 - 60 words)"
              name="about"
              value={userData.about}
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setabout(e.target.value);
              }}
            ></textarea>
          </div>

          {/* 3rd col */}

          <div class="h-40 w-70  absolute top-[950px] left-[60px]  mt-4  md:top-[40px] md:mt-8 lg:mt-[13rem] lg:text-xl md:left-[720px] xl:left-[930px] xl:mt-10 xl:top-[220px] af">
            <textarea
              type="text"
              class="rounded-xl bg-white text-black font-bold h-[12rem] max-h-[12rem] w-[16rem] md:h-28 md:max-h-28 md:w-[270px] border-2 border-black   text-base text-start p-2"
              placeholder=" what wil you miss the most after   graduating"
              name="question_1"
              value={userData.question_1}
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setquestion_1(e.target.value);
              }}
            ></textarea>
          </div>

          <div class="h-40 w-70  absolute top-[1180px] left-[60px]  mt-4  md:top-[40px] md:mt-8 lg:mt-[22rem] lg:text-xl md:left-[720px] xl:left-[930px] xl:mt-12 xl:top-[360px] af">
            <textarea
              type="text"
              class="rounded-xl bg-white text-black font-bold h-[13rem] max-h-[13rem] w-[16rem] md:h-28 md:max-h-28 md:w-[270px] border-2 border-black   text-base text-start p-2"
              placeholder=" If you had power to implement a change in college what would it be?"
              name="question_2"
              value={userData.question_2}
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setquestion_2(e.target.value);
              }}
            ></textarea>
          </div>
          <div id="recaptcha-container"></div>

          <button
            className="submit1"
            id="sub5"
            disabled={state}
            onClick={() => {
              {
                if (
                  alternate_contact_details === "" ||
                  address === "" ||
                  about === "" ||
                  question_1 === "" ||
                  question_2 === ""
                ) {
                  HandleEmpty("");
                } else {
                  setHid(7);
                  onSubmit();
                  // resendOTP();
                }
              }
            }}
            class="border-2 border-black bg-white text-black h-8 w-32 bottom-[2rem]  left-32 flex items-center justify-center absolute lg:left-[469px] lg:bottom-8  p-0 text-base leading-none text-center  rounded-3xl md:bottom-[7rem] md:mt-32 md:w-32 md:h-10  lg:mt-8 xl:bottom-10  xl:left-[648px] btnh border-dashed afd"
          >
            {" "}
            Continue{" "}
          </button>

          <button
            onClick={() => {
              setHid(5);
            }}
          >
            {" "}
            <img
              src={Abtn}
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${
                isDarkMode ? "bg-gray-400" : "bg-white"
              }`}
            />{" "}
          </button>
        </div>
        {/* fourth page */}

        <div
          class={
            hid == 7
              ? " h-screen w-screen   flex justify-center items-center  relative  border-b-2  "
              : "hidden"
          }
        >
          <div class="h-12 w-full top-44 left-4 absolute text-[23px]  md:text-3xl md:top-40 lg:text-[34px] xl:text-4xl lg:top-48 flex justify-center items-center asr ">
            {" "}
            Don't take it personally "Corporate" wants to verify your phone
            number{" "}
          </div>

          <div class=" h-10 w-full top-[250px] left-0 absolute  md:top-64 md:w-100 lg:mt-4 md:text-[18px] flex justify-center asr">
            {" "}
            (Enter the OTP you recieved on your phone){" "}
          </div>

          <div class="h-14 w-48  absolute top-80 flex justify-center items-center flex-row md:mt-0 lg:mt-10 lg:text-xl afu">
            <input
              type="text"
              class="h-[32px] w-[200px] lg:h-10 lg:w-64 lg:mt-12 border-2 rounded-2xl text-center border-black  "
              maxLength={6}
              onChange={(e) => {
                setOtp1(e.target.value);
                setOtp(e.target.value);
              }}
            ></input>
          </div>

          {/* <a href={linkOTP}> */}
          <button
            disabled={seconds > 0 || minutes > 0}
            style={{
              color:
                seconds > 0 || minutes > 0
                  ? `${isDarkMode ? "gray" : "#DFE3E8"}`
                  : `${isDarkMode ? "white" : "#000000"}`,
            }}
            onClick={() => {
              resendOTP();
            }}
            class="hover:underline  underline-offset-2 flex items-center justify-center mt-80  h-8 w-32 left-8 absolute p-0 text-xl leading-none md:ml-52 md:top-96 md:mt-28 md:w-32 md:h-10 lg:mt-36  lg:left-40 xl:left-64 afu"
          >
            {" "}
            Resend Otp{" "}
          </button>
          {/* </a> */}
          <div class="flex mt-64 left-12 absolute  md:top-52 md:ml-52 md:h-10 md:text-[20px] lg:mt-72 lg:left-40 xl:left-64 afu ">
            {seconds > 0 || minutes > 0 ? (
              <p>
                Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </p>
            ) : (
              <p>Didn't recieve code?</p>
            )}
          </div>

          <button
            onClick={() => {
              HandleEmpty(Otp1);
              handleContinune();
              if (Otp1 !== "") {
                otpVerify();
              }
            }}
            disabled={isButtonDisabled}
            class="h-8 w-32 flex items-center justify-center mt-64 border-2 border-black bg-white text-black absolute right-8  p-0 text-base leading-none text-center  rounded-3xl md:mr-32 md:top-96 md:mt-20 md:w-32 md:h-10 lg:right-52 xl:right-[350px]  lg:mt-28 btnh border-dashed afu"
          >
            {" "}
            Continue{" "}
          </button>

          {/* <button
            onClick={() => {
              setHid(6);
            }}
          >
            {" "}
            <img
              src={Abtn}
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${
                isDarkMode ? "bg-gray-400" : "bg-white"
              }`}
            />{" "}
          </button> */}
        </div>
        {/* sixth page */}

        <div
          class={
            hid == 8
              ? " h-screen w-screen   flex justify-center items-center text-1xl relative  border-b-2 "
              : "hidden"
          }
        >
          <div class="h-12 w-full top-44 left-4 absolute text-2xl  md:text-4xl md:top-40 lg:text-4xl xl:text-5xl lg:top-48 flex justify-center items-center atd ">
            Check your inbox   <span class="ml-2 lg:text-3xl lg:mt-2">   (Personal email)</span> {" "}
          </div>

          <div class="h-12 w-full top-56 left-4 absolute text-2xl  md:text-[20px] md:top-52 lg:text-[22px] lg:top-64 flex justify-center items-center afu">
            (You may now close this window){" "}
          </div>

          {/* <button
            onClick={() => {
              setHid(7);
            }}
          >
            {" "}
            <img
              src={Abtn}
              class=" h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr"
            />{" "}
          </button> */}

          
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

export default Fill3;
