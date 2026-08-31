import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import jwt_decode from "jwt-decode";

function GoldCard() {
  const { profile, loggedin, loading } = useContext(LoginContext);

  const navigate = useNavigate();

  // NEW: alumni data will come from backend
  const [alumniData, setAlumniData] = useState([]);

  // NEW: to know when API request is finished
  const [alumniDataLoaded, setAlumniDataLoaded] = useState(false);

  let userDetails = null;

  if (window.localStorage.getItem("token") !== null) {
    userDetails = jwt_decode(window.localStorage.getItem("token"));
  }

  /*
   * Fetch alumni emails from backend
   */
  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/getAlumniData`,
        );

        setAlumniData(res.data);
        setAlumniDataLoaded(true);
      } catch (err) {
        console.error("Failed to fetch alumni data:", err);

        setAlumniDataLoaded(true);
      }
    };

    fetchAlumniData();
  }, []);

  /*
   * Existing authentication / alumni check
   */
  useEffect(() => {
    // Don't check until required data has loaded
    if (loading || !alumniDataLoaded) {
      return;
    }

    // User is not logged in
    if (!loggedin) {
      window.location.href = "/login";
      return;
    }

    // No user details
    if (!userDetails) {
      window.location.href = "/";
      return;
    }

    // GoldCard is for students/non-alumni.
    // If the user is an alumni, redirect home.
    if (alumniData.includes(userDetails.email)) {
      window.location.href = "/";
      return;
    }
  }, [loading, loggedin, alumniDataLoaded, alumniData]);

  const profile1 = () => {
    const profile = JSON.parse(window.localStorage.getItem("profile"));

    // navigate(`/profile/nongrad/${profile.name}/${profile.email}`);

    navigate(`/profile/nongrad/${userDetails.name}/${userDetails.email}`);
  };

  // Don't render until authentication + alumni check is complete
  if (loading || !alumniDataLoaded) {
    return null;
  }

  return (
    <>
      {/* some classes are defined in fill details3 .css such as bgr */}

      <div className="h-[100vh] w-[100vw] bg-cover">
        <div className="h-60 relative top-[30px] flex flex-col items-center lg:top-[70px] afl">
          <div className="text-[18px] text-green-400 ml-2 top-10 relative font-bold sm:text-2xl md:text-3xl tracking-wide lg:mr-[100px]">
            Hmm, looks like you are
            <span className="text-red-700 text-2xl md:text-3xl lg:text-4xl">
              {" "}
              NOT{" "}
            </span>
            graduating this year
          </div>

          <p className="text-[18px] text-white top-16 relative font-bold md:text-3xl sm:text-2xl lg:mt-4 tracking-wide lg:mr-[200px] mb-8">
            Thanks for signing up, anyway!
          </p>

          <p className="text-[18px] text-white mb-16 top-12 relative font-bold md:text-3xl sm:text-2xl lg:w-auto lg:top-8 lg:mt-5">
            Here's a souvenir for all your troubles
          </p>

          <p className="top-4 text-green-400 relative lg:text-[20px] lg:top-2">
            (We don't know if this is usefull yet)
          </p>
        </div>

        <div className="flex items-center justify-center afu">
          <img
            src="/images/MemberCards/GoldCard.jpg"
            className="h-[180px] w-[350px] xl:h-[200px] xl:w-[370px] rounded-[15px] bgr relative top-[70px] lg:top-[110px] xl:top-[130px] exclude-dark-mode"
            alt="Gold Card"
          />
        </div>

        <div className="flex items-center justify-center afu">
          <a
            href={`/profile/nongrad/${userDetails?.name}/${userDetails?.email}`}
          >
            <button className="border-2 h-[40px] w-[170px] border-black bg-white text-black flex justify-center items-center btnh border-dashed relative rounded-2xl top-[100px] text-xl lg:top-[130px] xl:top-[170px]">
              Continue
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
export default GoldCard;
