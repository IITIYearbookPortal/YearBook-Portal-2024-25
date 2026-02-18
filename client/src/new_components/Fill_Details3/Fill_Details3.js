import React, { useState, useEffect } from "react";
import profilepic from "./profile.jpeg";
import arrow from "./arrow.png";
import "./filldetails.module.css";
import phoneimg from "./telephone-call.png";
// import Abtn from "./arrowBtn.png";
import Abtn from "./image.png";
//import arrow6 from "./arrow8.png";
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
  const [len, setlen] = useState(0);

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
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   return storedThemeMode === "dark";
  // });

  const auth = getAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (event) => {
    let inputstr = event.target.value;
    setlen(inputstr.length);
  };

  const onSubmit = () => {
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 6000);
    const formData = new FormData();

    formData.append("email", user.email);
    formData.append("name", userData.name);
    formData.append("roll_no", userData.roll_no);
    formData.append("academic_program", userData.academic_program);
    formData.append("department", userData.department);
    formData.append("personal_email_id", userData.personal_email_id);
    formData.append("contact_details", userData.contact_details);
    formData.append(
      "alternate_contact_details",
      userData.alternate_contact_details,
    );
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
              callback: (response) => { },
            },
            auth,
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
      .catch((err) => { });
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
          .catch((err) => { });
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
      appVerifier,
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

  // const uploadImage = () => {
  //   setUploaded(true);

  //   const formData = new FormData();
  //   formData.append("file", imageSelected);
  //   formData.append("upload_preset", "profile_img");

  //   setWait(true);
  //   axios
  //     .post("https://api-eu.cloudinary.com/v1_1/djcp8pnh2/upload", formData)
  //     .then((res) => {
  //       setWait(false);
  //       setImageUrl(res.data.url);
  //       setImageUploaded(true);
  //       setTimeout(() => {
  //         setImageUploaded(false);
  //       }, 10000);
  //     });
  // };

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
      .catch((err) => { });
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

          <div class="h-52 w-full mb-10 absolute top-64 flex justify-center items-center flex-col md:flex-row md:mt-4 lg:mt-10 lg:text-xl afr">
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
                <option
                  value="MS-DSM"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
                  MS-DSM
                </option>
                onChange=
                {(e) => {
                  setAcadP(e.target.value);
                }}
              </select>
            </div>

            <div class="h-12 w-64 flex flex-col mt-4 md:w-56 md:mb-5 md:mt-0 lg:w-80 lg:mt-0 lg:mb-4 items-center">
              <h1 class=" text-base text-center   lg:text-2xl text-[#EEEEEE]">
                Department
              </h1>

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
                <option
                  value="Physics"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Physics
                </option>
                <option
                  value="Chemistry"
                  name="department"
                  class="selct bg-[#222831]"
                >
                  Chemistry
                </option>
                <option
                  value="Mathematics"
                  name="department"
                  class="selct bg-[#222831]"
                >
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
                <option
                  value="MS-DSM"
                  name="academic_program"
                  class="selct bg-[#222831]"
                >
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
            class="border-2 border-[#EEEEEE] bg-[#222831] text-[#EEEEEE] flex justify-center items-center h-[35px] w-[130px] lg:h-10 lg:w-32 bottom-[5rem] absolute p-0 mb-1 text-base leading-none text-center afu  rounded-3xl md:top-96 md:mt-14   md:w-32 md:h-10  lg:mt-36 btnh border-dashed "
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
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${isDarkMode ? "bg-gray-400" : "bg-[#222831]"
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
            Do tell us your{" "}
            <span class="text-red-600 ml-4">phone number</span>{" "}
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
                color: "white",
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
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${isDarkMode ? "bg-gray-400" : "bg-[#222831]"
                }`}
            />{" "}
          </button>
        </div>

        {/* fifth page */}

        <div
          class={
            hid == 4
              ? " min-h-screen w-screen overflow-y-auto  flex flex-col lg:flex-row justify-start lg:justify-center items-center text-1xl relative border-b-2 bg-[#222831] "
              : "hidden"
          }
        >
          <div class="h-12 w-full top-44 left-4 absolute text-3xl flex-wrap  md:text-3xl md:top-40 lg:text-4xl xl:text-3xl lg:top-48 flex justify-center items-center afd text-[#EEEEEE]">
            {" "}
            And your{" "}
            <span class="text-red-600 flex-wrap ml-2 mr-2 text-5xl">
              {" "}
              Personal{" "}
            </span>{" "}
            email ?{" "}
          </div>

          <div class="h-14 w-48 lg:h-14 lg:w-72 absolute top-[310px] lg:top-72 mt-0 flex justify-center items-center flex-row lg:mt-0 lg:text-xl afd">
            <input
              type="text"
              placeholder="Personal Email ID*"
              name="personal_email_id"
              value={userData.personal_email_id}
              class="h-[32px] w-[200px] mb-10 max-w-xs lg:h-10 lg:w-64 lg:mt-12 border-2 border-white   rounded-2xl text-center bg-[#222831]"
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
            class="border-2 border-[#EEEEEE] bg-[#222831] text-[#EEEEEE] h-8 w-32 mt-60 flex items-center justify-center lg:bottom-60 absolute bottom-10 lg:top-[400px] p-0 text-base leading-none text-center rounded-3xl md:top-96 md:mt-32 md:w-32 md:h-10 lg:mt-16 btnh border-dashed afd"
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
              class={`h-[60px] w-[60px] lg:h-[83px] lg:w-[90px] bottom-12 absolute top-[23px] right-8 md:top-[24px] xl:top-[14px] lg:right-10 xl:w-[97px] xl:h-[97px] btnh2 afr ${isDarkMode ? "bg-gray-400" : "bg-[#222831]"
                }`}
            />{" "}
          </button>

          <div class=" afu w-full flex sm:block justify-center items-center">
            <img
              src={emailimg}
              alt="phone"
              class="h-[90px] w-[90px] lg:h-40 lg:w-40 mx-auto sm:ml-48 sm:mx-0"
            />
          </div>
        </div>

        {/* seventh page */}

        <div
          className={
            hid == 5
              ? "min-h-screen w-screen flex flex-col justify-center items-center bg-[#222831] text-white p-6 relative overflow-x-hidden"
              : "hidden"
          }
        >
          {/* Back Button - Top Right */}
          <button
            onClick={() => setHid(4)}
            className="absolute top-6 right-6 z-50 hover:scale-105 transition-transform"
          >
            <img
              src={Bbtn}
              alt="Back"
              className={`h-14 w-14 lg:h-20 lg:w-20 rounded-full ${isDarkMode ? "bg-gray-400" : ""}`}
            />
          </button>

          <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Section */}
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                We wanna
                <span className="text-red-600 px-4 animate-pulse">SEE</span>
                you! please?
              </h1>
              <p className="text-lg md:text-2xl text-gray-400 font-light italic">
                (we assure you, we are not creepy) 🙂
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="relative flex flex-col items-center">
              {/* Decorative Arrow for Desktop */}
              <img
                src={arrow}
                alt="arrow"
                className="hidden lg:block absolute -left-32 top-1/2 -translate-y-1/2 w-32 h-24 filter invert opacity-50 -rotate-12"
              />

              {/* Profile Preview Circle */}
              <div className="relative group">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-dashed border-gray-500 overflow-hidden flex justify-center items-center bg-[#393E46] transition-all group-hover:border-blue-500">
                  <img
                    src={preview || profilepic}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* File Input Label */}
                <label className="mt-6 flex flex-col items-center cursor-pointer group">
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-lg">
                    Choose profile photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">
                Image will be uploaded on final submit
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-16">
            <button
              onClick={() => {
                if (profileImage) {
                  setHid(6);
                } else {
                  toast("Please select a profile picture", {
                    theme: "dark",
                    autoClose: 3000,
                  });
                }
              }}
              className="bg-white text-black px-12 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
            >
              Continue
            </button>
          </div>
        </div>

        {/* eight page */}
        <div
          class={
            hid == 6
              ? "min-h-screen w-screen relative border-b-2 bg-[#222831] text-white overflow-y-auto"
              : "hidden"
          }
        >

          {/* WRAPPER */}
          <div className="relative min-h-screen pb-32">

            {/* TITLE */}
            <div class="w-full text-[20px] mt-8 text-center md:text-4xl lg:text-[42px] xl:text-4xl">
              Maybe, also fill these as well ?
            </div>

            <div class="w-full mt-4 text-center md:text-2xl px-4">
              (Our design team was out on vacation at this, so we couldn't create
              individual pages for this) 😅
            </div>

            <div class="flex flex-col items-center mt-12 gap-4">

              <input
                type="text"
                class="font-bold h-[35px] w-[225px] md:h-10 md:w-[270px] border-2 border-black text-black text-sm rounded-xl px-3"
                placeholder="Alternate Contact Number"
                name="alternate_contact_details"
                value={userData.alternate_contact_details}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              />

              <input
                type="text"
                class="font-bold h-[35px] w-[225px] md:h-10 md:w-[270px] border-2 border-black text-black text-sm rounded-xl px-3"
                placeholder="Address"
                name="address"
                value={userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              />

              <input
                type="text"
                class="font-bold h-[35px] w-[225px] md:h-10 md:w-[270px] border-2 border-black text-black text-sm rounded-xl px-3"
                placeholder="Current company (if any)"
                name="current_company"
                value={userData.current_company}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              />

              <input
                type="text"
                class="font-bold h-[35px] w-[225px] md:h-10 md:w-[270px] border-2 border-black text-black text-sm rounded-xl px-3"
                placeholder="Designation (if any)"
                name="designation"
                value={userData.designation}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              />

            </div>

            <div class="flex justify-center mt-10 relative">
              <textarea
                maxLength={300}
                class="rounded-xl bg-white text-black font-bold h-[13rem] w-[16rem] md:h-80 md:w-[300px] border-2 border-black text-base p-2"
                placeholder="About Me (50 - 60 words)"
                name="about"
                value={userData.about}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              ></textarea>
            </div>

            <div class="flex justify-center mt-10">
              <textarea
                class="rounded-xl bg-white text-black font-bold h-[8rem] w-[16rem] md:h-28 md:w-[300px] border-2 border-black text-base p-2"
                placeholder="What will you miss the most after graduating?"
                name="question_1"
                value={userData.question_1}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              ></textarea>
            </div>

            <div class="flex justify-center mt-6">
              <textarea
                class="rounded-xl bg-white text-black font-bold h-[6rem] w-[16rem] md:h-28 md:w-[300px] border-2 border-black text-base p-2"
                placeholder="If you had power to implement a change in college what would it be?"
                name="question_2"
                value={userData.question_2}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              ></textarea>
            </div>

          </div>

          {/*  CONTINUE BUTTON  */}

          <div className="w-full flex justify-center py-8">
            <button
              disabled={state}
              onClick={() => {
                if (
                  !userData.alternate_contact_details ||
                  !userData.address ||
                  !userData.about ||
                  !userData.question_1 ||
                  !userData.question_2
                ) {
                  HandleEmpty("");
                } else {
                  setHid(7);
                  onSubmit();
                }
              }}
              class="border-2 border-black bg-white text-black h-10 w-32 
             flex items-center justify-center text-base 
             rounded-3xl border-dashed"
            >
              Continue
            </button>
          </div>

        </div>

        {/* fourth page */}
        <div
          class={
            hid == 7
              ? "h-screen w-screen bg-[#222831] text-white flex flex-col items-center relative border-b-2"
              : "hidden"
          }
        >

          <div class="w-full mt-10 text-[23px] md:text-3xl lg:text-[34px] xl:text-4xl text-center px-6">
            Don't take it personally "Corporate" wants to verify your phone number
          </div>

          {/*  SUBTEXT  */}
          <div class="w-full mt-6 md:text-[18px] text-center">
            (Enter the OTP you recieved on your phone)
          </div>

          {/*  OTP INPUT  */}
          <div class="mt-8 flex justify-center">
            <input
              type="text"
              class="h-[32px] w-[200px] lg:h-10 lg:w-64 text-black border-2 rounded-2xl text-center border-black"
              maxLength={6}
              onChange={(e) => {
                setOtp1(e.target.value);
                setOtp(e.target.value);
              }}
            />
          </div>

          {/*  CONTINUE BUTTON */}
          <button
            onClick={() => {
              HandleEmpty(Otp1);
              handleContinune();
              if (Otp1 !== "") {
                otpVerify();
              }
            }}
            disabled={isButtonDisabled}
            class="h-10 w-32 mt-6 border-2 border-black bg-white text-black 
           text-base rounded-3xl border-dashed"
          >
            Continue
          </button>

          {/*  BOTTOM SECTION  */}
          <div className="absolute bottom-10 w-full flex flex-col items-center gap-2">

            <div className="text-center">
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
              disabled={seconds > 0 || minutes > 0}
              style={{
                color:
                  seconds > 0 || minutes > 0
                    ? `${isDarkMode ? "gray" : "#DFE3E8"}`
                    : `${isDarkMode ? "#222831" : "white"}`,
              }}
              onClick={resendOTP}
              class="hover:underline underline-offset-2 text-xl"
            >
              Resend Otp
            </button>

          </div>

        </div>

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
        {/* sixth page */}

        <div
          class={
            hid == 8
              ? " h-screen w-screen bg-[#222831] text-white flex justify-center items-center text-1xl relative  border-b-2 "
              : "hidden"
          }
        >
          <div class="h-12 w-full top-44 left-4 absolute text-2xl  md:text-4xl md:top-40 lg:text-4xl xl:text-5xl lg:top-48 flex justify-center items-center atd ">
            Check your inbox{" "}
            <span class="ml-2 lg:text-3xl lg:mt-2"> (Personal email)</span>{" "}
          </div>

          <div class="h-12 w-full top-56 left-4 absolute text-2xl  md:text-[20px] md:top-52 lg:text-[22px] lg:top-64 flex justify-center items-center afu">
            (Check spam folder as well and close this window){" "}
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
            class="border-2 px-6 py-1 border-black bg-white text-black btnh border-dashed rounded-3xl afu md:mt-16 lg:mt-40 text-[1.3rem] "
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
