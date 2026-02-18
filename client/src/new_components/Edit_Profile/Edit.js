import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../helpers/Context";
import "./Edit.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Edit({ isDarkMode }) {
  const { profile, loggedin, isStudent, loading } = useContext(LoginContext);
  const navigate = useNavigate();
  const { roll, name } = useParams();

  const [userData, setUserData] = useState({});
  const [imageFile, setImageFile] = useState(null);   // NEW image (for backend)
  const [imageUrl, setImageUrl] = useState("");       // What <img> displays
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!loggedin) navigate("/login");
      if (isStudent || profile?.roll_no !== roll || profile?.name !== name) {
        navigate("/error");
      }
    }
  }, [loading, loggedin, isStudent, profile, roll, name, navigate]);

  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setUserData({ ...profile });

      // Load existing profile image from backend
      setImageUrl(profile.profile_img || "");
      setImageFile(null); // No new image selected yet
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Revoke ONLY old blob URLs (never backend URLs)
    if (imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);      // Send to backend on submit
    setImageUrl(previewUrl); // Preview immediately
  };

  useEffect(() => {
    return () => {
      if (imageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const onUpdate = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Send image ONLY if user selected a new one
      if (imageFile) {
        formData.append("profile_img", imageFile);
      }

      const fields = [
        "email",
        "name",
        "roll_no",
        "academic_program",
        "department",
        "address",
        "current_company",
        "designation",
        "about",
        "question_1",
        "question_2",
      ];

      fields.forEach((field) => {
        formData.append(field, userData[field] ?? "");
      });

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/updateUser`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Updated successfully!", {
        theme: "dark",
      });

      if (res.data.user) {
        setTimeout(() => {
          window.location.href = `/profile/${res.data.user.roll_no}/${res.data.user.name}`;
        }, 1500);
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="containre">
        <div className="container2 flex flex-row">
          <div
            className={`leftprt ${isDarkMode ? "bg-gray-700 border-white" : "bg-[#111827] border-black"
              } border-2`}
          >
            <h1 id="fill">Edit your Profile</h1>

            <input className="inped mb-4" name="name" value={userData.name || ""} onChange={handleChange} placeholder="Name" />
            <input className="inped mb-4" name="roll_no" value={userData.roll_no || ""} onChange={handleChange} placeholder="Roll Number" />

            <select className="slt" name="academic_program" value={userData.academic_program || ""} onChange={handleChange}>
              <option value="" disabled>Academic Program</option>
              <option value="Bachelor of Technology (BTech)">Bachelor of Technology (BTech)</option>
              <option value="Master of Technology (MTech)">Master of Technology (MTech)</option>
              <option value="Master of Science (MSc)">Master of Science (MSc)</option>
              <option value="Five Year BTech + MTech">Five Year BTech + MTech</option>
              <option value="MS (Research)">MS (Research)</option>
              <option value="Doctor of Philosophy">Doctor of Philosophy</option>
              <option value="MS-DSM">MS-DSM</option>
            </select>

            <select className="inped slt" name="department" value={userData.department || ""} onChange={handleChange}>
              <option value="" disabled>Department</option>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Metallurgy Engineering and Materials Science">Metallurgy Engineering and Materials Science</option>
              <option value="Astronomy, Astrophysics and Space Engineering">Astronomy, Astrophysics and Space Engineering</option>
              <option value="Biosciences and Biomedical Engineering">Biosciences and Biomedical Engineering</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Humanities and Social Sciences">Humanities and Social Sciences</option>
              <option value="Electric Vehicle Technology">Electric Vehicle Technology</option>
            </select>

            <input className="inped mb-4" name="address" value={userData.address || ""} onChange={handleChange} placeholder="Address" />
            <input className="inped mb-4" name="current_company" value={userData.current_company || ""} onChange={handleChange} placeholder="Current Company" />
            <input className="inped mb-4" name="designation" value={userData.designation || ""} onChange={handleChange} placeholder="Designation" />

            <textarea className="inped mb-2" name="about" value={userData.about || ""} onChange={handleChange} placeholder="About Me (50–60 words)" />

            <p className="mb-2 text-white">Q1. What will you miss the most after graduating?</p>
            <input className="inped mb-4" name="question_1" value={userData.question_1 || ""} onChange={handleChange} />

            <p className="mb-2 text-white">Q2. College change you'd implement?</p>
            <input className="inped" name="question_2" value={userData.question_2 || ""} onChange={handleChange} />

            <div className="btn-wrapper">
              <button
                className="sbmit1 mt-5"
                onClick={onUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>

          </div>

          <div className="rightprt">
            <img
              id="ip"
              className="bg-cover w-64 object-cover"
              src={imageUrl || "https://via.placeholder.com/150"}
              alt="Profile"
            />
            <h4 id="disclaimer">
              <div className="disc">Disclaimer:</div> This picture will be printed in the yearbook.
            </h4>
            <input className="inped" type="file" accept="image/*" onChange={handleImageChange} />
            <p className="text-xs text-gray-400 mt-2">Image updates locally. Saved on Update.</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Edit;
