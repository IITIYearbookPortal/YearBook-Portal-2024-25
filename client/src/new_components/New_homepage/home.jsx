import { VolumeOff, VolumeUp } from "@mui/icons-material";
import sound from "./sample.mp3";
import React, { useEffect, useRef, useState } from "react";
import { Element } from "react-scroll";
import "./homepage.module.css";
import Footer from "./footer";
import { motion,useScroll,useTransform } from "framer-motion";

import { LoginContext } from "../../helpers/Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import alumniData from "../Navbar/akumniData.json";
import jwt_decode from "jwt-decode";

const Home = () => {
  // const token = jwt_decode(window.localStorage.getItem("token"))

  const {
    setUser,
    user,
    setLoggedin,
    loggedin,
    setProfileIcon,
    setVerified,
    setProfile,
    setFill,
    setOneTimeVerified,
    isStudent,
    setIsStudent,
  } = useContext(LoginContext);

  const SoundPlayer = () => {
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef();

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        audioRef.current.loop = true;
        audioRef.current.volume = 0.1;
        audioRef.current.play();
      }
    }, [isMuted]);

    const toggleMute = () => {
      setIsMuted(!isMuted);
    };

    return (
      <div className="pt-[50vh] snap-start absolute left bottom w-fit h-fit z-[1000]">
        <div className="sound-player-container">
          <audio ref={audioRef} autoPlay>
            <source src={sound} type="audio/mpeg" />
          </audio>
          <div className="sound-icon" onClick={toggleMute}>
            {isMuted ? (
              <VolumeOff fontSize="large" />
            ) : (
              <VolumeUp fontSize="large" />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Getting all the alumnis data

  const navigate = useNavigate();
  const loginComponentRef = useRef(null);
  const footerComponentRef = useRef(null);
  const scrollToLoginComponent = () => {
    loginComponentRef.current.scrollIntoView();
  };
  const scrollToFooterComponent = () => {
    footerComponentRef.current.scrollIntoView();
  };
  // const callFunctionForLogin = () => {
  //   const pathname = window.location.pathname;
  //   if (pathname === "/login") {
  //     scrollToLoginComponent();
  //   }
  // };
  // const callFunctionForFooter = () => {
  //   const pathname = window.location.pathname;
  //   if (pathname === "/footer") {
  //     scrollToFooterComponent();
  //   }
  // };
  const logout = () => {
    // window.location.reload();
    setUser({});
    navigate("/");
    setLoggedin(false);
    window.localStorage.clear();
    // document.getElementById("google-login").hidden = false;
  };

  // const callFunctionLogout = () => {
  //   const pathname = window.location.pathname;
  //   if (pathname === "/logout") {
  //     logout();
  //   }
  // };

  useEffect(() => {
    if (window.location.pathname === "/login") {
      scrollToLoginComponent();
    } else if (window.location.pathname === "/footer") {
      scrollToFooterComponent();
    } else if (window.location.pathname === "/logout") {
      logout();
    }
  }, [window.location.pathname]);
  const svgpathVariants = {
    initial: {
      opacity: 0,
      pathLength: 0,
    },
    final: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 5,
        delay: 1,
        ease: "easeInOut",
      },
    },
  };

  const FirstPage = () => {
    return (
      <Element
        name="first"
        id="hero"
        className="snap-start relative h-screen w-screen flex flex-col items-center justify-center   bg-cover px-4 md:px-0"
      >
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="snap-scroll text-3xl md:text-5xl   text-center"
        >
          "Change can be scary, but so is staying in the same place" <br />
        </motion.h1>
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="snap-scroll text-xl md:text-3xl   text-center mt-4 md:mt-8"
        >
          - Anonymous
        </motion.h1>

        <motion.div
          className="flex flex-row absolute bottom-6 md:bottom-12"
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <h1 className="text-sm md:text-xl text-center md:text-left">
            Scroll Down to Continue
          </h1>
          <img
            src="/images/homepage/down_arrow.png"
            className="w-4 md:w-6 mt-1 h-4 md:h-6 mx-auto md:ml-1 exclude-dark-mode"
          ></img>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute right-6 md:right-12 bottom-6 md:bottom-12"
        >
          {!loggedin && (
            <a href="#signin">
              <h1 className="text-sm md:text-xl hover:underline">Skip Intro</h1>
            </a>
          )}
        </motion.div>
      </Element>
    );
  };
  const SecondPage = () => {
    return (
      <Element
        name="second"
        className="snap-start min-h-screen flex flex-col items-center justify-center   bg-cover p-4"
      >
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl md:text-3xl   text-center"
        >
          "We are sad to see you go. <br />
        </motion.h1>
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl md:text-3xl   text-center"
        >
          but the best thing to do is remember the past <br />
        </motion.h1>
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl md:text-3xl   text-center"
        >
          and <span className="text-3xl md:text-5xl">MOVE</span> on, right?"
        </motion.h1>
      </Element>
    );
  };

  const ThirdPage = () => {
    return (
      <Element
        name="third"
        className="snap-start min-h-screen flex flex-col items-center justify-center relative   bg-cover p-4"
      >
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg md:text-3xl text-center leading-loose"
        >
          In{" "}
          <span className="text-3xl md:text-5xl">
            20<span className="text-[#d94d3c]">21</span>
          </span>
          , we learnt how to embrace
        </motion.h1>
        <br />
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-5xl   text-center"
        >
          SICKNESS
        </motion.h1>

        <motion.img
          viewport={{ once: false }}
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -30 }}
          transition={{ duration: 1, delay: 2 }}
          src="/images/homepage/covid.png"
          alt=""
          className="absolute left-4 md:left-0 bottom-32 md:bottom-50 w-28 md:w-52 exclude-dark-mode"
        />
        <motion.img
          viewport={{ once: false }}
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -30 }}
          transition={{ duration: 1, delay: 1 }}
          src="/images/homepage/covid.png"
          alt=""
          className="absolute left-[50%] bottom-0 w-16 md:w-32 exclude-dark-mode"
        />
        <motion.img
          viewport={{ once: false }}
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 30 }}
          transition={{ duration: 1, delay: 3 }}
          src="/images/homepage/covid.png"
          alt=""
          className="absolute right-0 top-10 w-32 md:w-40 exclude-dark-mode"
        />
      </Element>
    );
  };

  const FourthPage = () => {
    return (
      <Element
        name="fourth"
        className="snap-start h-screen flex flex-col items-center justify-center   bg-cover relative"
      >
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl lg:text-3xl   text-center"
        >
          In{" "}
          <span className="text-3xl lg:text-5xl">
            20<span className="text-[#d94d3c]">22</span>
          </span>
          , we learnt to accept
        </motion.h1>
        <br />

        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-3xl md:text-5xl   text-center md:text-right md:ml-48"
        >
          THE NEW NORMAL
        </motion.h1>
        <motion.img
          viewport={{ once: true }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          src="/images/homepage/mask.png"
          alt=""
          className="absolute md:left-12 bottom-20 top-30 w-3/4 ml-8 md:ml-0 md:w-1/3 exclude-dark-mode"
        />
      </Element>
    );
  };

  // const FifthPage = () => {
  //   return (
  //     <Element
  //       name="fifth"
  //       className="snap-start min-h-screen flex flex-col items-center justify-center   bg-cover relative p-4"
  //     >
  //       <motion.h1
  //         viewport={{ once: true }}
  //         initial={{ opacity: 0, y: 20 }}
  //         whileInView={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 1 }}
  //         className="text-2xl md:text-3xl   text-center"
  //       >
  //         In{" "}
  //         <span className="text-4xl md:text-5xl">
  //           20<span className="text-[#d94d3c]">23</span>
  //         </span>
  //         , we learnt the importance of
  //       </motion.h1>
  //       <br />
  //       <motion.h1
  //         viewport={{ once: true }}
  //         initial={{ opacity: 0, y: 20 }}
  //         whileInView={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 1, delay: 1 }}
  //         className="text-4xl md:text-5xl   text-center "
  //       >
  //         CONNECTIONS
  //       </motion.h1>
  //       <motion.div
  //         className="flex flex-col gap-2 absolute -left-10 md:left-32 bottom-0"
  //         viewport={{ once: true }}
  //         initial={{ opacity: 0, x: -20, rotate: "135deg" }}
  //         whileInView={{ opacity: 1, x: 0 }}
  //         transition={{ duration: 1, delay: 2 }}
  //       >
  //         <div className="w-32 md:w-48 h-32 md:h-48 border-2 border-black overflow-clip">
  //           <div className="w-48 md:w-72 h-48 md:h-72 -ml-8 md:-ml-12 -mt-8 md:-mt-12 rotate-[-135deg]">
  //             <img
  //               src="/images/homepage/connections/7.jpg"
  //               className="w-full h-full object-cover rounded-none exclude-dark-mode"
  //             ></img>
  //           </div>
  //         </div>
  //         <div className="flex flex-row gap-2">
  //           <div className="w-32 md:w-48 h-32 md:h-48 border-2 border-black overflow-clip">
  //             <div className="w-48 md:w-72 h-48 md:h-72 -ml-8 md:-ml-12 -mt-8 md:-mt-12 rotate-[-135deg]">
  //               <img
  //                 src="/images/homepage/connections/1.jpg"
  //                 className="w-full h-full object-cover rounded-none exclude-dark-mode"
  //               ></img>
  //             </div>
  //           </div>
  //           <div className="w-32 md:w-48 h-32 md:h-48 border-2 border-black overflow-clip">
  //             <div className="w-48 md:w-72 h-48 md:h-72 -ml-8 md:-ml-12 -mt-8 md:-mt-12 rotate-[-135deg]">
  //               <img
  //                 src="/images/homepage/connections/3.jpg"
  //                 className="w-full h-full object-cover rounded-none exclude-dark-mode"
  //               ></img>
  //             </div>
  //           </div>
  //         </div>
  //       </motion.div>
  //       <motion.div
  //         viewport={{ once: true }}
  //         initial={{ opacity: 0, x: 20, rotate: "45deg" }}
  //         whileInView={{ opacity: 1, x: 0 }}
  //         transition={{ duration: 1, delay: 2 }}
  //         className="flex gap-2 absolute right-4 md:-right-32 top-32"
  //       >
  //         <div className="w-32 md:w-48 h-32 md:h-48 border-2 border-black overflow-clip">
  //           <div className="w-48 md:w-72 h-48 md:h-72 -ml-8 md:-ml-12 -mt-8 md:-mt-12 rotate-[-45deg]">
  //             <img
  //               src="/images/homepage/connections/2.jpg"
  //               className="w-full h-full object-cover rounded-none exclude-dark-mode"
  //             ></img>
  //           </div>
  //         </div>
  //         <div className="w-32 md:w-48 h-32 md:h-48 border-2 border-black overflow-clip">
  //           <div className="w-48 md:w-72 h-48 md:h-72 -ml-8 md:-ml-12 -mt-8 md:-mt-12 rotate-[-45deg]">
  //             <img
  //               src="/images/homepage/connections/5.jpg"
  //               className="w-full h-full object-cover scale-x-[-1] rounded-none exclude-dark-mode"
  //             ></img>
  //           </div>
  //         </div>
  //       </motion.div>
  //     </Element>
  //   );
  // };
  const FifthPage = () => {
    const containerref = useRef(null);
    const textcontainer = useRef(null);
    const { scrollYProgress: photoscroll } = useScroll({
      target: containerref,
      offset: ["start 0.8", " start 0.1"]
    });
    const { scrollYProgress:textscroll } = useScroll({
      target: textcontainer,
      offset: ["start 0.6", " start 0.1"]
    });
  
    useEffect(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
      return () => {
        document.documentElement.style.scrollBehavior = 'auto';
      };
    }, []);
  
    const scale = useTransform(
      photoscroll,
      [0, 1],
      [8, 1]
    );
  
    const opacity = useTransform(
      textscroll,
      [0, 1],
      [0, 1]
    );
  
    const textY = useTransform(
      textscroll,
      [0.5, 1],
      ['80vh', '30vh']
    );
  
    return (
      <Element
       
      className=" snap-none  h-[100vh]   w-full flex  items-center justify-center"  >
        <motion.div
        ref={containerref}  className="sticky rounded-xl inset-0 w-4/5 h-4/5 overflow-hidden">
          <motion.div 
          
            className="bg-black absolute flex flex-wrap h-full inset-0 w-full "
            style={{ scale }}
          >
            <img  
                src="/images/homepage/connections/1.jpg"
              alt="Background"
              className="w-1/3 p-2 h-1/2 object-cover"
            />
            <img  
                src="/images/homepage/connections/2.jpg"
              alt="Background"
              className="w-1/3 p-2 h-1/2 object-cover"
            />
            <img  
                src="/images/homepage/connections/3.jpg"
              alt="Background"
              className="w-1/3 p-2 h-1/2 object-cover"
            />
            <img  
                src="/images/homepage/connections/4.jpg"
              alt="Background"
              className="w-1/3 p-2 h-1/2 object-cover"
            />
            <img    
                src="/images/homepage/connections/5.jpg"
              alt="Background"
              className="w-1/3 p-2 h-1/2 object-cover"
            />
            <img  
                src="/images/homepage/connections/6.jpg"
              alt="Background"
              className="w-1/3 p-2 h-1/2 object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
          
          <motion.div 
            className="absolute left-0 right-0"
            style={{ opacity, y: textY }}
            
          >
            <motion.h1 ref={textcontainer} className="text-white w-full text-6xl md:text-8xl font-bold text-center px-4">
              Explore The World
              
            </motion.h1>
          </motion.div>
        </motion.div>
      </Element>
    );
  };
  const SixthPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      const storedThemeMode = localStorage.getItem("themeMode");
      return storedThemeMode === "dark";
    });

    return (
      <Element
        name="sixth"
        className="snap-start relative h-screen flex flex-col items-center justify-center bg-cover"
      >
        <div className="-mt-32 md:mt-0 text-center">
          <motion.h1
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl   md:-ml-96"
          >
            In{" "}
            <span className="text-5xl">
              20<span className="text-[#d94d3c]">24</span>
            </span>
            , we
          </motion.h1>
          <motion.h1
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-5xl    md:-ml-56 text-bold mt-4"
          >
            GRADUATE
          </motion.h1>
          <motion.h1
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="text-3xl   mt-4"
          >
            leaving behind, a legacy of
          </motion.h1>
          <motion.h1
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
            className="text-5xl   md:ml-30 mt-6"
          >
            Resilience
          </motion.h1>
          <motion.h1
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
            className="text-3xl   text-center my-2"
          >
            and
          </motion.h1>
          <motion.h1
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
            className="text-5xl text-center text-bold"
          >
            Friendship
          </motion.h1>
        </div>
        <motion.svg className="absolute bottom-0 md:left-0 w-full md:w-1/2 h-96 md:h-96">
          <motion.g
            transform="translate(0.000000,473.000000) scale(0.100000,-0.100000)"
            fill="none"
            stroke={`${isDarkMode ? "white" : "black"}`}
            strokeWidth="5"
          >
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M1844 4087 c-251 -85 -323 -122 -295 -150 7 -7 11 -63 11 -155 0
-123 -3 -147 -16 -157 -12 -9 -18 -31 -20 -81 -2 -38 -5 -95 -8 -126 -4 -45
-2 -56 9 -52 7 3 15 -2 18 -13 3 -14 7 -11 17 15 11 30 30 44 30 22 0 -5 5
-10 10 -10 15 0 12 76 -5 117 -19 46 -19 77 1 94 14 12 14 14 -5 21 -15 5 -21
16 -21 40 0 33 21 251 25 256 1 1 57 -18 123 -43 128 -48 142 -51 142 -35 0 6
3 10 8 10 4 0 7 -45 7 -99 0 -55 4 -103 8 -107 17 -18 28 24 24 94 l-4 73 26
-6 c80 -20 141 -24 229 -13 79 10 95 9 103 -3 5 -8 8 -64 7 -125 -3 -102 -5
-114 -31 -153 -55 -83 -167 -126 -224 -86 -11 8 -35 51 -53 95 -18 44 -37 83
-43 87 -19 12 4 -72 38 -132 55 -100 52 -126 -19 -148 -41 -13 -66 -30 -98
-65 -57 -63 -90 -85 -168 -112 -36 -13 -73 -30 -84 -39 -29 -25 -67 -21 -96
12 -14 16 -50 41 -80 55 -35 17 -62 39 -75 60 -42 69 -82 117 -100 120 -22 4
-45 29 -45 49 0 7 6 12 13 10 7 -1 11 7 9 22 -1 16 11 40 35 70 60 73 66 81
57 81 -5 -1 -29 -26 -54 -56 l-44 -54 -18 34 c-10 19 -27 37 -38 41 -11 3 -20
13 -20 22 0 17 58 91 129 165 48 50 67 54 119 22 32 -21 28 -38 -25 -106 -25
-33 -41 -59 -35 -57 15 5 102 121 102 136 0 18 -49 52 -87 59 -29 5 -39 2 -62
-21 -42 -39 -156 -183 -156 -196 0 -6 -21 -19 -47 -29 -60 -23 -105 -55 -123
-88 -8 -15 -33 -47 -56 -72 -51 -55 -99 -128 -99 -150 0 -21 57 -76 95 -90 25
-10 32 -9 46 7 8 10 36 38 62 63 l47 44 35 -34 c26 -25 34 -41 31 -55 -15 -55
-37 -207 -51 -359 -18 -189 -14 -219 36 -260 36 -31 133 -62 214 -70 55 -5 54
-4 -25 13 -47 10 -104 27 -128 36 -51 21 -92 67 -92 103 0 23 1 24 13 8 8 -10
19 -15 29 -11 23 9 80 96 111 171 33 77 117 332 117 353 0 9 4 23 10 31 8 12
11 12 27 -2 10 -9 34 -23 53 -31 20 -8 48 -29 63 -46 24 -29 27 -40 27 -111 0
-89 16 -180 32 -180 11 0 7 104 -8 213 -9 66 9 61 47 -15 44 -88 81 -150 86
-145 2 3 -17 45 -43 95 -59 113 -57 133 18 158 89 29 130 54 195 117 34 33 65
59 67 56 9 -9 -34 -147 -69 -220 -33 -70 -45 -129 -26 -129 10 0 29 46 62 155
19 64 63 155 74 155 3 0 2 -31 -1 -69 -10 -100 -4 -107 48 -57 24 22 85 66
137 96 92 54 191 145 191 176 0 30 14 18 194 -173 28 -29 47 -55 44 -58 -9 -9
-81 36 -109 69 -26 29 -31 31 -100 31 -61 -1 -84 -6 -127 -28 -115 -60 -148
-109 -242 -362 -61 -163 -89 -225 -101 -225 -9 0 -23 48 -34 115 -9 58 -25
105 -36 105 -13 0 -11 -26 6 -117 8 -43 15 -90 15 -105 0 -16 4 -28 9 -28 5 0
7 9 4 20 -3 11 0 20 6 20 6 0 11 -4 11 -10 0 -5 8 -10 19 -10 23 0 34 22 117
242 36 95 76 192 89 215 22 36 104 118 111 110 2 -1 -11 -41 -27 -87 -28 -78
-135 -467 -146 -533 -4 -18 -14 -32 -29 -37 -13 -5 -47 -25 -75 -45 -29 -20
-57 -34 -63 -32 -6 2 -14 32 -17 68 -4 51 -6 42 -6 -46 0 -60 2 -95 4 -77 3
24 11 36 28 42 14 5 48 25 76 45 28 19 56 35 63 35 7 0 12 -24 14 -61 3 -73
19 -113 47 -116 15 -1 16 -1 3 3 -22 7 -38 63 -38 131 0 52 0 52 25 43 16 -6
25 -6 25 0 0 5 -11 12 -25 16 -30 7 -30 6 -6 85 11 35 31 114 46 174 32 136
91 328 116 377 32 63 97 68 220 15 34 -14 40 -23 78 -122 l42 -106 -20 -62
c-10 -34 -29 -100 -41 -147 -19 -72 -41 -138 -85 -255 -5 -14 -5 -17 2 -10 18
17 71 167 103 291 17 65 33 121 36 123 8 9 3 -67 -11 -164 -27 -176 -26 -172
-17 -150 5 11 17 73 27 138 14 87 21 113 28 101 6 -11 7 -289 3 -748 -7 -661
-2 -999 18 -1245 6 -69 -8 -54 -22 24 -15 82 -137 673 -157 762 -9 40 -21 75
-26 78 -13 9 -13 7 26 -248 20 -126 34 -232 32 -234 -2 -2 -25 77 -52 174 -63
237 -102 358 -121 373 -37 31 -39 4 -36 -392 1 -210 0 -380 -2 -377 -2 2 -20
45 -39 94 -37 97 -127 283 -159 328 -11 15 -28 27 -38 27 -21 0 -22 -8 -40
-300 -6 -96 -15 -179 -21 -184 -5 -6 -9 3 -9 25 0 71 -55 368 -92 493 -34 119
-41 71 -23 -165 41 -557 65 -685 128 -708 12 -4 81 -4 152 0 283 17 497 53
527 89 16 19 17 75 15 728 -1 389 -5 750 -8 802 -3 52 -6 -268 -7 -712 l-2
-807 -27 -14 c-64 -32 -448 -81 -587 -75 -60 3 -71 6 -88 28 -40 55 -71 298
-93 740 -4 80 -3 98 5 75 25 -70 63 -279 96 -524 14 -106 36 21 54 319 6 96
13 176 16 179 19 19 139 -208 208 -393 24 -67 47 -113 51 -107 4 7 1 160 -5
341 -12 326 -8 484 12 478 18 -6 47 -93 119 -362 93 -344 108 -361 69 -80 -22
155 -23 218 -1 93 20 -116 140 -692 146 -697 15 -15 16 56 5 281 -15 299 -16
450 -12 1242 4 666 4 665 -62 834 -20 51 -36 95 -36 97 0 3 18 -5 40 -16 45
-23 50 -24 50 -9 0 16 -28 50 -143 172 -128 137 -147 166 -147 234 0 48 3 54
29 68 33 16 46 44 36 75 -7 21 -30 27 -40 10 -14 -23 -25 -7 -25 35 0 25 5 45
10 45 6 0 10 -11 10 -24 0 -14 5 -28 10 -31 9 -6 16 49 12 97 -2 19 15 23 126
32 57 5 82 -4 47 -18 -38 -14 23 -54 133 -87 39 -11 42 -15 42 -47 0 -24 -8
-41 -28 -60 -42 -40 -73 -132 -79 -234 -7 -107 9 -159 67 -212 44 -41 47 -51
24 -77 -37 -41 -43 -87 -42 -319 l2 -225 6 235 c5 197 8 240 23 268 10 17 21
32 25 32 4 0 20 -24 35 -54 36 -68 108 -140 222 -219 49 -34 90 -68 93 -74 3
-10 -21 -13 -97 -13 -90 0 -101 -2 -101 -17 0 -27 97 -159 108 -148 3 3 -13
26 -35 52 -38 46 -63 84 -63 98 0 4 35 6 78 5 115 -4 122 -3 122 19 0 14 -29
40 -92 83 -116 80 -188 150 -222 216 -33 65 -34 86 -3 79 156 -37 213 -75 299
-202 27 -39 80 -108 119 -155 63 -75 119 -166 119 -195 0 -5 -14 -18 -30 -27
-25 -14 -30 -23 -30 -55 1 -21 8 -49 16 -63 11 -17 13 -19 9 -5 -15 46 -17 85
-5 100 19 23 38 18 43 -12 4 -26 4 -26 6 5 0 18 6 32 14 32 8 0 8 3 2 8 -6 4
-16 26 -23 49 -13 43 -68 124 -158 229 -29 34 -68 86 -87 116 -18 29 -56 73
-82 96 -52 46 -54 67 -2 37 93 -53 156 -108 172 -151 9 -24 21 -44 26 -44 18
0 8 40 -21 87 -16 26 -30 50 -30 54 0 18 -64 100 -100 129 -33 26 -40 38 -40
66 0 29 3 34 24 34 66 0 125 118 151 305 6 42 9 47 16 27 11 -29 -4 -147 -31
-243 -11 -40 -20 -90 -20 -110 l0 -37 -40 5 c-22 3 -40 2 -40 -3 0 -14 70 -84
84 -84 6 0 -1 10 -15 23 -14 12 -32 30 -39 40 -12 17 -11 18 16 11 16 -3 40
-13 52 -21 31 -19 43 -7 14 13 -29 20 -28 56 3 169 33 119 41 203 25 259 -15
54 1 140 28 151 44 18 147 43 156 38 12 -8 0 -190 -19 -278 -18 -86 -18 -96
-3 -92 7 1 14 -8 16 -20 6 -38 22 -25 22 17 0 47 16 53 25 10 4 -16 11 -30 16
-30 14 0 11 43 -10 111 -14 45 -20 97 -21 176 -1 108 0 114 24 138 l25 25 -41
21 c-22 11 -102 59 -177 106 l-135 85 -51 -17 c-27 -10 -125 -51 -217 -92
l-167 -73 -98 54 c-139 77 -379 179 -433 183 -35 3 -85 -10 -236 -60z m411
-14 c135 -57 335 -161 335 -173 0 -10 -48 -18 -162 -26 l-97 -7 -3 44 c-3 42
-5 45 -58 71 -30 15 -86 32 -124 37 -79 11 -223 -2 -243 -22 -7 -7 -16 -41
-19 -75 -4 -34 -9 -62 -11 -62 -2 0 -40 20 -86 44 -101 55 -155 69 -193 50
-15 -8 -29 -12 -31 -10 -17 17 48 49 214 106 203 71 275 90 313 84 19 -3 94
-31 165 -61z m883 -55 c53 -33 128 -79 165 -101 61 -36 66 -42 53 -55 -8 -9
-48 -24 -88 -34 -40 -10 -81 -21 -90 -24 -13 -4 -17 1 -16 27 2 79 -138 103
-323 55 -141 -36 -149 -40 -149 -76 0 -19 -6 -33 -17 -37 -18 -7 -150 34 -160
50 -7 12 33 44 67 52 14 4 32 12 40 19 19 16 349 162 418 185 2 1 47 -27 100
-61z m-927 -24 c85 -25 109 -47 109 -99 0 -27 -7 -51 -19 -66 -19 -23 -20 -23
-39 -6 -19 17 -28 18 -133 7 -110 -12 -186 -8 -222 12 -16 8 -18 17 -12 71 8
71 16 84 53 90 72 11 212 6 263 -9z m-505 -62 c89 -37 88 -50 -1 -20 -49 17
-92 32 -94 34 -12 11 60 1 95 -14z m28 -43 c48 -17 86 -35 86 -40 0 -7 -88 22
-180 59 -60 25 16 10 94 -19z m1384 -13 c38 -20 42 -49 12 -111 l-19 -40 -10
28 c-6 15 -14 39 -17 53 -12 47 -70 59 -193 39 -50 -8 -114 -24 -142 -34 l-50
-20 3 22 c2 16 16 25 61 39 164 50 289 58 355 24z m-66 -48 c18 -15 62 -143
54 -157 -13 -21 -70 -21 -183 -1 -69 13 -142 20 -175 18 -63 -5 -65 -3 -52 60
7 34 27 46 129 72 82 22 204 26 227 8z m-1022 -13 c52 0 122 2 154 5 40 3 60
1 63 -7 6 -18 -196 -28 -279 -13 -37 6 -68 16 -68 22 0 6 7 7 18 2 9 -5 60 -9
112 -9z m-133 -122 c-3 -10 -5 -2 -5 17 0 19 2 27 5 18 2 -10 2 -26 0 -35z
m446 -24 c-7 -25 -30 -42 -47 -36 -21 8 -13 36 15 57 26 20 40 11 32 -21z
m502 1 c26 -7 23 -8 -20 -8 -27 0 -59 3 -70 8 -26 11 46 11 90 0z m-29 -23
l82 -12 -20 -42 c-11 -23 -37 -62 -57 -85 -58 -66 -75 -105 -76 -173 0 -45 6
-70 22 -97 12 -21 21 -38 19 -38 -2 0 -18 5 -35 11 -26 9 -38 9 -58 -2 -23
-13 -27 -11 -58 23 -56 60 -68 145 -40 266 17 74 48 137 72 151 22 13 47 13
149 -2z m231 -2 c58 1 62 -1 58 -20 -2 -11 -6 -46 -9 -77 -12 -114 -80 -258
-123 -258 -8 0 -43 23 -80 50 -36 28 -68 48 -71 45 -3 -3 -3 -6 -1 -8 105 -75
111 -81 106 -118 -6 -43 5 -64 45 -89 27 -16 112 -129 104 -138 -2 -2 -38 19
-79 45 -41 26 -102 65 -135 85 -75 45 -102 91 -102 173 0 69 16 107 69 167 23
26 53 71 67 102 24 54 26 55 57 48 18 -4 60 -7 94 -7z m-1490 -50 c-4 -8 -11
-15 -17 -15 -7 0 -7 6 0 21 13 23 26 19 17 -6z m1783 -57 c-14 -41 -14 -42
-18 -14 -5 42 6 82 20 68 8 -8 8 -23 -2 -54z m-1770 1 c0 -11 4 -29 10 -39 7
-13 5 -29 -7 -57 -17 -37 -17 -38 -21 -10 -2 15 -8 27 -13 27 -10 0 -7 33 7
83 7 24 24 21 24 -4z m-440 -19 c12 -22 1 -27 -18 -8 -6 6 -15 9 -18 5 -4 -4
10 -25 30 -47 20 -22 36 -44 36 -49 0 -23 -18 -18 -39 9 -25 35 -69 66 -78 56
-4 -3 15 -28 41 -55 58 -59 46 -77 -13 -21 -23 22 -52 40 -64 40 -20 -1 -19
-3 13 -33 19 -17 46 -39 60 -48 21 -14 23 -19 12 -32 -12 -14 -21 -11 -83 31
-38 25 -69 50 -69 53 0 20 60 75 105 95 61 29 71 29 85 4z m45 -20 c17 -34 20
-60 5 -60 -10 0 -19 17 -34 68 -11 33 11 27 29 -8z m1110 -10 c6 -25 0 -38
-35 -83 -66 -83 -175 -163 -185 -135 -20 57 -26 68 -39 68 -8 0 -16 13 -18 30
-4 26 -2 30 11 23 9 -4 34 -7 57 -7 49 -1 131 48 165 99 29 43 36 43 44 5z
m27 -85 c-23 -50 -107 -127 -198 -180 -50 -30 -106 -66 -123 -81 -18 -14 -33
-25 -35 -23 -1 2 0 44 2 92 4 85 5 88 33 103 37 18 46 13 55 -31 3 -20 9 -37
13 -40 17 -10 115 61 177 129 42 46 73 71 78 66 6 -6 5 -19 -2 -35z m-1332
-76 l53 -61 -49 -49 -48 -49 -29 35 c-16 20 -42 42 -58 51 -23 12 -27 18 -20
32 14 26 81 102 90 102 5 0 32 -27 61 -61z m57 5 c19 -15 24 -26 19 -39 -6
-16 -11 -14 -47 21 -22 21 -45 47 -51 58 -10 18 -9 18 21 0 17 -10 43 -28 58
-40z m153 25 c13 -24 7 -34 -56 -95 l-43 -41 -22 23 c-22 23 -22 24 -4 44 10
11 22 17 27 14 5 -3 12 3 15 15 3 12 11 21 19 21 7 0 18 9 24 20 14 26 26 25
40 -1z m79 -54 c33 -38 36 -45 22 -45 -5 0 -24 18 -41 40 -39 49 -24 53 19 5z
m-2 -37 c62 -61 65 -82 29 -193 -21 -67 -23 -69 -35 -46 -7 13 -37 49 -66 81
-29 32 -61 69 -70 84 -17 25 -17 26 32 75 26 27 50 49 53 50 2 1 28 -22 57
-51z m668 1 c-19 -36 -25 -35 -18 4 3 15 12 27 19 27 12 0 12 -5 -1 -31z m495
-35 c14 -15 13 -15 -10 -9 -46 14 -70 24 -70 31 0 12 64 -6 80 -22z m-1545
-20 c34 -34 38 -54 11 -54 -11 0 -44 32 -75 73 -26 34 26 19 64 -19z m-61 -10
c3 -8 2 -12 -4 -9 -6 3 -10 10 -10 16 0 14 7 11 14 -7z m1976 -26 c19 -8 41
-22 49 -31 17 -21 17 -21 -47 3 -29 11 -63 20 -75 20 -30 0 -40 10 -26 26 11
13 35 9 99 -18z m-1574 -156 l42 -42 -39 -108 c-54 -148 -121 -253 -146 -228
-14 13 -6 111 23 303 l28 186 25 -34 c14 -19 44 -53 67 -77z m-122 3 c-7 -49
-14 -99 -14 -110 -1 -11 -4 -14 -7 -7 -5 13 14 172 24 198 11 30 11 7 -3 -81z
m142 -2 c-6 -7 -19 8 -57 62 -15 21 -8 17 21 -13 23 -24 39 -46 36 -49z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M3540 3699 c-35 -14 -70 -49 -70 -70 0 -9 38 -53 85 -97 62 -59 85
-87 85 -106 0 -29 24 -56 51 -56 11 0 19 -7 19 -16 0 -8 -4 -13 -9 -10 -5 3
-16 -15 -26 -40 -18 -48 -101 -166 -138 -197 -12 -10 -41 -31 -64 -48 l-43
-30 -37 20 c-46 23 -283 94 -291 87 -6 -6 -5 -7 113 -41 184 -53 211 -66 194
-97 -15 -28 6 -52 33 -37 16 8 19 17 14 40 -5 25 0 32 37 58 48 33 96 83 146
153 19 27 36 46 38 44 2 -1 -3 -32 -11 -67 -8 -35 -22 -123 -31 -196 -24 -183
-12 -233 55 -218 29 6 30 5 30 -27 0 -18 12 -57 25 -87 14 -30 22 -58 17 -63
-13 -13 -123 -49 -138 -46 -8 2 -34 52 -59 112 -46 114 -88 186 -107 186 -11
0 -7 -94 7 -150 6 -24 5 -24 -17 4 -82 105 -104 129 -113 125 -14 -6 -7 -34
36 -138 22 -52 38 -95 37 -96 -2 -1 -12 -7 -23 -14 -18 -11 -18 -12 8 -8 23 4
30 -1 43 -29 25 -52 38 -59 73 -38 17 10 33 15 36 12 3 -3 7 -50 7 -104 1 -90
-2 -107 -31 -184 -27 -70 -35 -106 -41 -199 -11 -173 -23 -175 -210 -34 -63
48 -168 123 -234 167 l-118 81 -54 119 c-30 66 -59 125 -65 130 -11 12 5 -27
65 -158 20 -43 35 -81 32 -83 -2 -3 -13 0 -24 6 -62 33 -103 -2 -101 -89 1
-42 3 -49 9 -30 4 14 8 44 9 66 1 49 16 59 70 44 49 -14 49 -14 110 -107 85
-132 181 -207 345 -273 102 -41 135 -38 160 15 10 22 22 74 27 115 4 41 16
102 27 135 11 34 23 83 27 110 4 28 13 88 21 133 14 86 11 122 -12 157 -8 11
-14 27 -14 37 0 26 -30 37 -78 28 -49 -9 -43 -16 -96 113 -40 96 -40 97 -27
97 5 0 27 -29 50 -63 23 -35 52 -74 66 -87 23 -22 25 -22 25 -4 0 10 -7 44
-15 74 -8 30 -15 66 -15 80 l0 25 20 -25 c11 -14 43 -80 72 -147 48 -115 53
-123 79 -123 25 0 135 36 151 49 4 3 -6 35 -22 71 -16 36 -30 82 -30 103 0 39
-8 44 -40 25 -31 -19 -52 9 -53 68 0 79 25 267 34 252 5 -7 9 -29 9 -48 0 -20
20 -78 50 -140 39 -84 51 -123 61 -195 12 -95 23 -120 39 -95 11 17 13 423 3
484 -4 26 -12 40 -25 44 -20 5 -19 14 13 90 l19 44 29 -24 c17 -13 30 -28 30
-34 1 -6 15 -17 31 -24 25 -10 37 -10 68 2 40 15 57 48 24 48 -11 0 -36 -7
-56 -15 -20 -8 -36 -11 -36 -6 0 4 23 18 50 29 28 12 50 25 50 30 0 13 -63 68
-100 87 -23 12 -30 22 -30 44 0 16 -3 36 -6 45 -10 25 -99 86 -127 86 -19 0
-46 21 -99 75 -75 77 -84 81 -128 64z m135 -85 c25 -29 45 -56 45 -59 0 -12
-65 -85 -75 -85 -5 1 -45 33 -89 73 -90 83 -94 101 -24 136 39 19 43 19 70 3
15 -9 48 -40 73 -68z m160 -102 c27 -21 51 -44 52 -52 2 -16 -95 -95 -105 -86
-3 4 12 24 33 46 21 22 35 43 31 47 -4 5 -24 -11 -44 -35 -20 -23 -45 -42 -54
-42 -25 0 -22 9 14 47 17 18 28 36 24 40 -4 5 -21 -7 -38 -25 -37 -43 -47 -35
-19 18 11 22 16 40 11 40 -6 0 -10 -3 -10 -7 0 -5 -9 -19 -20 -33 -19 -24 -20
-24 -20 -4 0 27 52 84 77 84 10 0 40 -17 68 -38z m-148 -97 c31 -28 24 -43
-12 -27 -15 7 -25 20 -25 32 0 26 5 25 37 -5z m164 -50 c-18 -50 -19 -51 -47
-31 -18 14 -18 16 16 45 19 17 38 30 41 31 4 0 -1 -20 -10 -45z m121 -24 c21
-14 38 -31 38 -37 0 -5 -23 -20 -51 -32 l-51 -21 -29 21 c-33 25 -36 43 -14
94 l15 36 27 -17 c16 -10 45 -30 65 -44z m-191 -3 c21 -17 39 -37 39 -45 0
-33 -54 -141 -87 -175 -24 -25 -32 -38 -22 -38 8 0 30 16 47 36 18 20 37 34
44 32 7 -3 16 -27 20 -54 8 -55 6 -444 -2 -444 -3 0 -11 38 -17 85 -9 66 -22
107 -59 183 -44 91 -47 103 -52 197 -3 75 0 118 14 177 10 43 22 78 27 78 4 0
26 -14 48 -32z m235 -103 c-11 -8 -31 -15 -45 -15 -26 1 -26 1 4 15 42 19 66
19 41 0z m-571 -245 c0 -7 -6 -15 -12 -17 -8 -3 -13 4 -13 17 0 13 5 20 13 18
6 -3 12 -11 12 -18z m93 -426 c2 -14 -6 -27 -23 -38 -32 -21 -51 -15 -67 19
-15 33 1 46 52 43 27 -2 36 -8 38 -24z m29 -96 c-3 -8 -6 -5 -6 6 -1 11 2 17
5 13 3 -3 4 -12 1 -19z m-528 -320 c42 -29 138 -98 213 -155 88 -65 151 -104
173 -109 29 -5 33 -9 24 -20 -17 -21 -46 -17 -138 21 -149 61 -248 139 -329
257 -52 76 -45 76 57 6z m481 -3 c-7 -25 -17 -45 -21 -45 -13 0 -11 19 8 61
22 50 29 42 13 -16z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2720 2717 c0 -27 38 -147 51 -162 9 -9 -12 71 -32 123 -5 14 -7 33
-4 43 4 11 2 19 -4 19 -6 0 -11 -10 -11 -23z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2740 2714 c0 -8 90 -124 96 -124 7 0 -3 17 -49 78 -38 50 -47 59
-47 46z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M1749 2636 c-15 -43 -15 -44 3 -33 10 7 18 16 18 22 0 5 3 20 6 33
11 40 -11 23 -27 -22z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2850 2567 c0 -5 34 -52 76 -105 93 -117 94 -119 94 -107 0 6 -32 51
-71 100 -78 100 -99 123 -99 112z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M1746 2538 c-3 -13 -6 -33 -6 -45 0 -18 -6 -22 -42 -25 -36 -3 -45
-8 -61 -38 l-20 -35 29 34 c22 24 36 32 54 30 23 -4 25 -7 23 -58 -3 -63 4
-63 15 0 6 34 12 45 32 50 l25 7 -23 1 c-23 1 -24 3 -17 51 7 51 2 67 -9 28z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2624 2460 c0 -58 1 -81 3 -52 2 28 2 76 0 105 -2 28 -3 5 -3 -53z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M1592 2516 c-56 -25 -82 -43 -42 -31 30 9 119 54 105 53 -5 0 -34
-10 -63 -22z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2989 2523 c12 -24 31 -39 31 -25 0 5 -10 17 -21 28 -22 19 -22 19
-10 -3z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M1430 2470 c0 -13 11 -13 30 0 12 8 11 10 -7 10 -13 0 -23 -4 -23
-10z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2471 2394 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2309 2343 c-12 -21 -49 -78 -82 -126 -32 -49 -57 -91 -54 -94 6 -6
115 154 146 215 27 52 21 55 -10 5z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M1836 2318 c9 -90 24 -162 34 -172 7 -7 17 -7 30 2 19 12 20 9 20
-60 0 -40 4 -79 9 -86 10 -16 57 36 187 208 47 63 89 117 92 120 10 10 -10
-56 -45 -148 -19 -52 -32 -96 -29 -99 10 -11 36 20 31 36 -3 10 8 54 25 99 29
81 39 137 21 130 -4 -1 -50 -58 -101 -126 -52 -68 -111 -142 -131 -165 l-38
-42 -1 70 c0 87 -10 107 -39 81 -20 -18 -21 -18 -31 10 -6 16 -14 66 -17 111
-3 46 -10 83 -14 83 -4 0 -6 -24 -3 -52z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M3251 2341 c-1 -27 2 -32 11 -23 8 8 8 17 0 34 -10 22 -11 21 -11
-11z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2451 2326 c-15 -56 -94 -159 -226 -295 -206 -212 -402 -371 -455
-371 -32 0 -95 63 -106 105 -8 34 22 325 51 495 4 24 3 30 -3 20 -14 -21 -62
-364 -62 -444 0 -36 -17 -4 -48 89 -47 141 -56 202 -43 279 6 36 14 74 18 83
4 12 3 15 -4 8 -14 -13 -33 -106 -33 -158 1 -55 20 -130 61 -242 43 -116 43
-136 -5 -655 -20 -223 -40 -439 -44 -480 l-7 -75 -450 -5 -450 -5 448 -3 c439
-2 448 -2 477 -23 24 -18 36 -21 83 -15 30 4 63 14 73 21 30 23 0 35 -88 35
-68 0 -78 2 -78 18 0 9 20 238 45 507 25 270 45 498 45 508 0 26 14 21 34 -14
23 -39 74 -71 101 -63 89 28 425 329 575 515 70 88 122 181 107 195 -3 3 -10
-10 -16 -30z m-746 -1666 c-28 -12 -135 -12 -135 0 0 6 32 10 78 9 52 0 71 -3
57 -9z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M3090 2321 c0 -20 -3 -22 -12 -13 -17 17 -33 15 -18 -3 25 -30 60
-11 41 22 -9 16 -10 15 -11 -6z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M2772 1590 c-1 -467 6 -685 24 -742 11 -34 33 -19 49 34 8 29 38 174
66 323 53 284 93 466 108 493 20 36 36 -44 96 -473 39 -277 59 -358 88 -363
38 -7 67 125 97 447 11 118 20 225 20 239 0 14 5 22 12 20 6 -2 30 -76 53
-164 22 -87 45 -168 51 -178 11 -19 12 -19 22 0 5 10 12 57 15 104 5 77 5 80
-4 30 -6 -30 -13 -71 -15 -90 -7 -46 -16 -29 -43 85 -51 211 -76 268 -96 218
-3 -10 -15 -115 -26 -233 -27 -303 -56 -460 -84 -460 -8 0 -19 17 -25 37 -12
42 -49 278 -74 473 -17 129 -29 201 -47 283 -8 35 -16 47 -29 47 -30 0 -59
-110 -134 -520 -51 -276 -67 -341 -81 -343 -20 -4 -26 109 -33 678 l-8 580 -2
-525z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M3527 1860 c-3 -14 -16 -104 -27 -200 -11 -96 -23 -190 -26 -208 -3
-19 -1 -32 4 -29 4 3 17 76 27 161 10 86 22 156 25 156 4 0 12 -190 18 -422 7
-233 15 -462 18 -510 3 -49 2 -88 -2 -88 -5 0 -24 29 -42 64 -55 106 -93 123
-106 49 -4 -21 -11 -54 -17 -74 l-9 -36 -242 -7 c-232 -7 -318 -16 -318 -36 0
-22 156 -47 362 -57 141 -7 163 0 193 57 15 29 17 30 90 30 65 0 74 -2 80 -20
8 -26 25 -26 25 0 0 20 8 20 628 23 l627 2 -627 3 -628 2 0 43 c0 23 -7 256
-15 517 -16 481 -26 628 -38 580z m-22 -1072 c19 -33 35 -61 35 -64 0 -2 -29
-4 -65 -4 -73 0 -72 -1 -54 78 18 77 17 76 35 62 8 -7 30 -40 49 -72z m-130
-88 c4 -6 -7 -24 -24 -40 -34 -34 -50 -36 -226 -20 -154 14 -265 31 -265 41 0
10 -8 10 210 19 266 11 298 11 305 0z"
            />
            <motion.path
              viewport={{ once: true }}
              variants={svgpathVariants}
              initial="initial"
              whileInView="final"
              d="M178 673 c84 -2 219 -2 300 0 81 1 12 3 -153 3 -165 0 -231 -2 -147
-3z"
            />
          </motion.g>
        </motion.svg>
      </Element>
    );
  };

  const SeventhPage = (props) => {
    return (
      <Element
        name="seventh"
        id="signin"
        className="snap-start relative h-screen flex flex-col items-center justify-center   bg-cover"
      >
        <motion.h1
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl   text-center relative"
        >
          One of us? Let us know by{" "}
          <span className="text-[#d94d3c]"> Signing in </span>
        </motion.h1>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 w-48 h-48"
        >
          <div id="google-login"></div>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 flex flex-row items-center justify-center text-center"
        >
          <h1 className="mb-2">Or scroll down to explore different paths</h1>
          <img
            src="/images/homepage/down_arrow.png"
            className="w-6 h-6 -mt-2 exclude-dark-mode"
          ></img>
        </motion.div>

        <motion.a
          href="#hero"
          className="absolute md:bottom-8 md:right-8 right-4 top-8"
          viewport={{ once: true }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <h1 className="hover:underline">View the intro again</h1>
        </motion.a>
      </Element>
    );
  };

  return (
    <>
    {/* this div properties causing problem in fifth page animation */}
      {/* <div className="lg:snap-y snap-none lg:snap-mandatory h-screen w-screen overflow-y-scroll overflow-x-hidden"> */}
      <div>
        {/* <SoundPlayer/> */}
        <FirstPage />
        <SecondPage />
        <ThirdPage />
        <FourthPage />
        <FifthPage />
        <SixthPage />
        <div ref={loginComponentRef}>
          {isStudent && !loggedin && <SeventhPage />}
          {!isStudent && !loggedin && <SeventhPage />}
        </div>
        <div ref={footerComponentRef}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
