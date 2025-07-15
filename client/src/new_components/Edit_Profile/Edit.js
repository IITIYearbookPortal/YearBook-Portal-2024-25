import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../helpers/Context";
import "./Edit.scss";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forbiddenError, unauthorizedError } from "../../utils/authErrors";

function Edit({ isDarkMode, setIsDarkMode, props }) {
  const { user, setUser, profile, loggedin, setLoggedin, isStudent, loading } =
    useContext(LoginContext);

  const [message, setMessage] = useState("");
  const [imageSelected, setImageSelected] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [verify, setVerify] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [upload, setUploaded] = useState(false);
  const [userData, setUserData] = useState({});
  const [verify2, setVeriify2] = useState(false);
  const [wait, setWait] = useState(false);
  const [imageUploadingStatus, setImageUploadingStatus] = useState("");
  const [rollNoisNumber, setRollNoisNumber] = useState("");
  const [isValidR, setIsValidR] = useState(true);
  const [Name, setName] = useState("");
  const [RollNo, setRollNo] = useState("");
  const [isSelected, setisSelected] = useState(false);
  const [hid, setHid] = useState(1);

  /* Params */
  var { roll, name } = useParams();

  useEffect(() => {
    if (!loading) {
      if (!loggedin) {
        window.location.href = "/login";
      }

      if (isStudent || profile.roll_no !== roll || profile.name !== name) {
        window.location.href = "/error";
      }
    }
  });

  const [email, setEmail] = useState(profile.email);
  useEffect(() => {
    setEmail(profile.email);
  }, [profile]);

  useEffect(() => {
    // setLoading(true);
    const Load = async () => {
      await new Promise((r) => setTimeout(r, 500));
      setImageUrl(profile.profile_img);
      // setLoading((loading) => !loading);
    };

    Load();
  }, [profile]);

  useEffect(() => {
    const getUserData = () => {
      axios
        .post(
          process.env.REACT_APP_API_URL + "/profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 404) {
            window.location.href = "/error";
          } else if (res.status === 401) {
            forbiddenError(setLoggedin, setUser);
          } else if (res.status === 403) {
            unauthorizedError(setLoggedin, setUser);
          } else {
            setUserData(res.data.User[0]);
          }
        })
        .catch((err) => {});
    };
    getUserData();
  }, [profile]);

  const uploadImage = () => {
    setUploaded(true);

    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "profile_img");

    setWait(true);
    axios
      .post("https://api-eu.cloudinary.com/v1_1/dd5ixerth/upload", formData)
      .then((res) => {
        setWait(false);
        setImageUrl(res.data.url);
        setImageUploaded(true);
        setTimeout(() => {
          setImageUploaded(false);
        }, 3000);
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

  const HandleDigitsOnly = (event) => {
    const containsOnlyDigits = /^\d+$/.test(event.target.value);
    setIsValidR(containsOnlyDigits);
    setRollNo(event.target.value);
  };

  const navigate = useNavigate();

  const onUpdate = () => {
    axios
      .put(
        process.env.REACT_APP_API_URL + "/updateUser",
        {
          email: email,
          name: userData.name,
          roll_no: userData.roll_no,
          academic_program: userData.academic_program,
          department: userData.department,
          /* personal_email_id: userData.personal_email_id,
        contact_details: userData.contact_details,
        alternate_contact_details: userData.alternate_contact_details, */
          address: userData.address,
          current_company: userData.current_company,
          designation: userData.designation,
          about: userData.about,
          profile_img: imageUrl,
          question_1: userData.question_1,
          question_2: userData.question_2,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 404) {
          window.location.href = "/error";
        } else if (res.status === 401) {
          forbiddenError(setLoggedin, setUser);
        } else if (res.status === 403) {
          unauthorizedError(setLoggedin, setUser);
        } else {
          toast(res.data.message, {
            theme: "dark",
            autoClose: 1500,
          });
          if (res.data.message === "Roll No. should be in Digits") {
            toast("Roll No. Cannot be digits!", {
              theme: "dark",
              autoClose: 3000,
            });
          }
          if (res.data.message === "All fields are required") {
            setRollNoisNumber(res.data.message);
            let timetochangemsg = setTimeout(() => {
              setRollNoisNumber("");
            }, 2000); // delay execution by 2 second

            return () => clearTimeout(timetochangemsg);
          }
          if (res.data.message === "User data updated successfully") {
            setVerify(true);
            setVeriify2(true);
            window.localStorage.setItem("verified", true);
            window.localStorage.setItem("profileIcon", true);
            const newProfile = {
              email: res.data.user.email,
              name: res.data.user.name,
              roll_no: res.data.user.roll_no,
              academic_program: res.data.user.academic_program,
              department: res.data.user.department,
              about: res.data.user.about,
              profile_img: res.data.user.profile_img,
              one_step_verified: res.data.user.one_step_verified,
              two_step_verified: res.data.user.two_step_verified,
            };
            // const p = JSON.stringify(newProfile);
            // window.localStorage.setItem("profile", p);
            // let updateData = () => {
            //   profile = newProfile;
            //   roll = profile.roll_no;
            //   name = profile.name;
            // };
            // updateData();
            let timetonavigate = setTimeout(() => {
              window.location.href = `/profile/${newProfile.roll_no}/${newProfile.name}`;
            }, 2000); // delay execution by 2 second

            return () => clearTimeout(timetonavigate);
          }
        }
      })
      .catch((err) => {});
  };

  const setOptionValue = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="containre">
        <div className="container2 flex flex-row">
          <div
            className={`leftprt ${
              isDarkMode
                ? "bg-gray-700 border-2 border-white"
                : " bg-[#111827] border-2 border-black"
            }`}
          >
            <h2> </h2>
            <br />
            <h1 id="fill">Edit your Profile</h1>
            <br />
            <input
              className="inped mb-4"
              type="text"
              placeholder="Name"
              size="60"
              name="name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
            />
            <br />
            <input
              className="inped mb-4"
              type="text"
              placeholder="Roll Number*"
              size="60"
              name="roll_no"
              value={userData.roll_no}
              onChange={(e) => {
                setUserData({ ...userData, [e.target.name]: e.target.value });
                setRollNo(e.target.value);
                HandleDigitsOnly(e);
              }}
            />
            <br />
            <select
              className="slt"
              name="academic_program"
              id="ddown"
              defaultValue={userData.academic_program}
              // style={{ width: '78%' }}
              onChange={setOptionValue}
            >
              <option value="" name="Academic Program" selected disabled>
                Academic Program
              </option>
              <option
                value="Bachelor of Technology (BTech)"
                name="academic_program"
              >
                Bachelor of Technology (BTech)
              </option>
              <option
                value="Master of Technology (MTech)"
                name="academic_program"
              >
                Master of Technology (MTech)
              </option>
              <option value="Master of Science (MSc)" name="academic_program">
                Master of Science (MSc)
              </option>
              <option value="Five Year BTech + MTech" name="academic_program">
                Five Year BTech + MTech
              </option>
              <option value="MS (Research)" name="academic_program">
                MS (Research)
              </option>
              <option value="Doctor of Philosophy" name="academic_program">
                Doctor of Philosophy
              </option>
              <option value="MS-DSM" name="academic_program">
                MS-DSM
              </option>
            </select>
            <br />
            {/* <input
                type="text"
                placeholder="Department*"
                size="60"
                name="department"
                value={userData.department}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
              /> */}

            <select
              class="inped slt"
              name="department"
              id="ddown"
              defaultValue={userData.department}
              // style={{ width: '78%' }}
              onChange={setOptionValue}
            >
              <option
                value=""
                class="selct"
                name="Department"
                disabled
                selected
              >
                Department
              </option>
              <option
                value="Computer Science and Engineering"
                name="department"
                class="selct"
              >
                Computer Science and Engineering
              </option>
              <option
                value="Electrical Engineering"
                name="department"
                class="selct"
              >
                Electrical Engineering
              </option>
              <option
                value="Mechanical Engineering"
                name="department"
                class="selct"
              >
                Mechanical Engineering
              </option>
              <option value="Civil Engineering" name="department" class="selct">
                Civil Engineering
              </option>
              <option
                value="Metallurgy Engineering and Materials Science"
                name="department"
                class="selct"
              >
                Metallurgy Engineering and Materials Science
              </option>
              <option
                value="Astronomy, Astrophysics and Space Engineering"
                name="department"
                class="selct"
              >
                Astronomy, Astrophysics and Space Engineering
              </option>
              <option
                value="Biosciences and Biomedical Engineering"
                name="department"
                class="selct"
              >
                Biosciences and Biomedical Engineering
              </option>
              <option value="Physics" name="department" class="selct">
                Physics
              </option>
              <option value="Chemistry" name="department" class="selct">
                Chemistry
              </option>
              <option value="Mathematics" name="department" class="selct">
                Mathematics
              </option>
              <option
                value="Humanities and Social Sciences"
                name="department"
                class="selct"
              >
                Humanities and Social Sciences
              </option>
              <option
                value="Electric Vehicle Technology"
                name="department"
                class="selct"
              >
                Electric Vehicle Technology
              </option>

              <option value="MS-DSM" name="academic_program">
                MS-DSM
              </option>
            </select>
            <br />

            <input
              className="inped mb-4"
              type="text"
              placeholder="Address*"
              size="60"
              name="address"
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
            />
            <br />
            <input
              className="inped mb-4"
              type="text"
              placeholder="Current Company (if any)"
              size="60"
              name="current_company"
              value={userData.current_company}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
            />
            <br />
            <input
              className="inped mb-4"
              type="text"
              placeholder="Designation"
              size="60"
              name="designation"
              value={userData.designation}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
            />
            <br />
            <input
              className="inped mb-2"
              type="text"
              maxLength={300}
              placeholder="About Me (50-60 words)"
              size="60"
              name="about"
              value={userData.about}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
            />
            <br />
            <p id="ques" className="mb-2">
              Q1. What will you miss the most after graduating?
            </p>
            <input
              className="inped mb-4"
              type="text"
              maxLength={200}
              placeholder="Write your answer in about 20-30 words"
              size="60"
              name="question_1"
              value={userData.question_1}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
            />
            <br />
            <p id="ques" className="mb-2">
              Q2. If you had the power to implement a change in college, what
              would it be?
            </p>
            <input
              class="inped"
              maxLength={200}
              type="text"
              placeholder="Write your answer in about 20-30 words"
              size="60"
              name="question_2"
              value={userData.question_2}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
            />
            <br />
            {/* {verify && <h2>{message}</h2>} */}
            <div id="emailver" class="flex flex-col">
              {/* <button className="submit1" onClick={onUpdate} id="sub5">
                    Update
                  </button> */}
              {!verify2 && (
                <button
                  className="sbmit1 rounded-2xl flex self-end border-2  border-dashed border-black bg-white px-6 py-1 mt-5 -ml-4 font-semibold uppercase   transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                  onClick={onUpdate}
                  id="sub5"
                >
                  Update
                </button>
              )}
              {verify && <h2 id="verificationmessage">{message}</h2>}
              <h2 id="verificationmessage">{rollNoisNumber}</h2>
              {/* {verify2 && changes && (
                  <button
                    className="submit1"
                    onClick={resendMail}
                    disabled={state}
                    id="sub5"
                    style={{ color: state ? '#D8D8D8' : '#fec90ad9' }}
                  >
                    Resend Mail
                  </button>
                )} */}
            </div>
          </div>
          <div className="rightprt">
            <span className="dt">
              <img
                id="ip"
                className="bg-cover object-cover"
                src={imageUrl}
                alt="Profile Photo"
              />
            </span>
            {/* <h2> </h2> */}
            <br />
            <h4 id="disclaimer">
              <div className="disc">Disclaimer:</div> This picture will be
              printed in the yearbook.
            </h4>
            <input
              className="inped"
              type="file"
              id="imgip"
              onChange={(event) => {
                setImageSelected(event.target.files[0]);
                if (event.target.files[0] === "") {
                  setisSelected(false);
                } else {
                  setisSelected(true);
                }
              }}
            />
            <button
              id="upimp"
              onClick={() => {
                if (isSelected) {
                  {
                    uploadImage();
                  }
                } else {
                  toast("Make sure you selected the pic!", {
                    theme: "dark",
                    autoClose: 3000,
                  });
                }
              }}
              className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-1 mt-5 font-semibold uppercase   transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none "
              style={{ color: "white" }}
            >
              Upload Photo
            </button>

            {upload && (
              <h3 class={`${isDarkMode ? "text-white" : "text-white"}`}>
                {wait && "Wait... while image is uploading"}
                {imageUploaded && "Image Uploaded"}
              </h3>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Edit;
