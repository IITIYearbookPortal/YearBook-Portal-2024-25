import React, { useContext } from "react";
import alumniData from "../Navbar/akumniData.json";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import jwt_decode from "jwt-decode";

function GoldCard() {

  const {profile, loggedin, loading} = useContext(LoginContext)
  let userDetails;
  if(window.localStorage.getItem("token")!==null){
    userDetails = jwt_decode(window.localStorage.getItem("token"))
  }

  if (!loading && !loggedin) {
    window.location.href = "/login";
  } else if (!loading && (userDetails === null || alumniData.includes(userDetails.email))) {
    window.location.href = "/";
  }
  const navigate = useNavigate();

  const profile1 = () => {
    const profile = JSON.parse(window.localStorage.getItem("profile"));
    // navigate(`/profile/nongrad/${profile.name}/${profile.email}`);
    navigate(`/profile/nongrad/${userDetails.name}/${userDetails.email}`);
  };
  return (
    <>
      {/* some classes are defined in fill details3 .css such as bgr */}

      <div className=" h-[100vh] w-[100vw]     bg-cover ">
        <div class="h-60 relative top-[30px] flex flex-col items-center lg:top-[70px]  afl ">
          <div class="text-[18px] ml-2 top-10 relative font-bold sm:text-2xl md:text-3xl tracking-wide lg:mr-[100px]">
            Hmm, looks like you are
            <span class="text-red-700 text-2xl md:text-3xl lg:text-4xl">
              {" "}
              NOT{" "}
            </span>
            graduating this year
          </div>

          <p class="text-[18px] top-16 relative font-bold md:text-3xl sm:text-2xl lg:mt-4 tracking-wide lg:mr-[200px] mb-8">
            Thanks for signing up, anyway!
          </p>

          <p class="text-[18px] mb-16 top-12 relative font-bold md:text-3xl sm:text-2xl lg:w-auto lg:top-8 lg:mt-5">
            Here's a souvenir for all your troubles
          </p>

          <p class=" top-4  relative lg:text-[20px]  lg:top-2 ">
            (We don't know if this is usefull yet)
          </p>
        </div>

        <div class="flex items-center justify-center afu">
          <img
            src="/images/MemberCards/GoldCard.jpg"
            className=" h-[180px] w-[350px] xl:h-[200px] xl:w-[370px] rounded-[15px] bgr relative top-[70px] lg:top-[110px] xl:top-[130px]  exclude-dark-mode"
          />
        </div>

        <div class="flex items-center justify-center afu">
          <a href={`/profile/nongrad/${userDetails.name}/${userDetails.email}`}>
            <button
              class="border-2 h-[40px] w-[170px]  border-black flex justify-center items-center btnh border-dashed relative rounded-2xl
     top-[100px] text-xl lg:top-[130px] xl:top-[170px]  "
            >
               {/* onClick={() => {
              profile1();
            }}  */}
            {/* onClick={profile1} */}
              {" "}
              Continue{" "}
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
export default GoldCard;
