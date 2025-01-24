import React, { useState } from "react";
import { motion } from "framer-motion";
import "./homepage.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode === "dark";
  });
  return (
    <div className="snap-end  bg-cover w-screen h-screen flex flex-col md:flex-row px-6 md:px-12 py-8 md:pt-12"
    style={{
      backgroundImage: `url(/images/global/bgl.jpg)`, //  background image
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}
    >
      <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-12 items-center md:items-start md:ml-8">
        <h1 className="text-3xl md:text-5xl text-center md:text-left">
          The Alumni Magazine? That's here
        </h1>
        <div className="flex flex-row gap-6 md:gap-12 justify-center">
          <button className="rounded-2xl border-2 w-48 md:w-64 h-48 md:h-64 border-dashed border-black font-semibold uppercase hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
            <a
              href="https://drive.google.com/file/d/16pFu5zcsdcZSJSddt78LaXL3fHX_8nJk/preview"
              target="_none"
            >
              {" "}
              <img
                src="/images/footer/alumnimag.png"
                className="w-full h-full object-cover rounded-2xl hover:rounded-md"
              ></img>
            </a>
          </button>
          <img
            src="/images/homepage/down_arrow.png"
            className={`-mt-8 md:-mt-12 w-16 md:w-32 h-16 md:h-32 rotate-90 ${
              isDarkMode ? "invert" : ""
            }`}
          ></img>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-lg md:text-2xl">
            Made with ❤️, by{" "}
            <span className="text-3xl md:text-5xl"> Alumni Cell</span>
          </h1>
          <h1 className="text-lg md:text-2xl md:w-96">
            The Alumni Cell is the student-run cell to connect and broaden the
            institute's alum network.
          </h1>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-lg md:text-2xl">
            Alumni and corporate relations office, 7th Floor,
            <br />
            Abhinandan Bhavan, Indian institute of Technology Indore,
            <br />
            Khandwa Road, Simrol, Indore-453552, India
          </h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-12 items-center md:items-start">
        <h1 className="text-3xl mt-8 md:mt-0 md:text-5xl text-center md:text-left">
          The Alumni Portal? That's here
        </h1>
        <div className="flex flex-row-reverse gap-6 md:gap-12 justify-center">
          <button className="rounded-2xl border-2 w-48 md:w-64 h-48 md:h-64 border-dashed overflow-clip border-black font-semibold uppercase hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
            <a href="https://alumni.iiti.ac.in/" target="_blank">
              {" "}
              <img
                src="/images/footer/ACR.png"
                className="w-full ml-2 h-full object-cover rounded-2xl hover:rounded-md"
              ></img>
            </a>
          </button>
          <img
            src="/images/homepage/down_arrow.png"
            className={`-mt-8 md:-mt-12 w-16 md:w-32 h-16 md:h-32 rotate-90 scale-y-[-1] ${
              isDarkMode ? "invert" : ""
            }`}
          ></img>
        </div>

        <h1 className="text-3xl md:text-5xl mt-4 md:mt-0 ml-0 md:ml-6">
          Find us On
        </h1>
        <div className="flex flex-row gap-6 md:gap-12 w-full md:-mt-8 justify-center md:justify-start px-6 md:px-24">
          <button className="w-12 h-12">
            <a
              href="https://www.instagram.com/alumni_cell_iiti/"
              target="_blank"
            >
              {" "}
              <img
                src="/images/footer/insta_filled.png"
                className="w-full h-full object-contain rounded-none hover:invert exclude-dark-mode"
              ></img>{" "}
            </a>
          </button>
          <button className="w-12 h-12">
            <a href="https://www.facebook.com/iitialumnicell/" target="_blank">
              {" "}
              <img
                src="/images/footer/fb.png"
                className="w-full h-full object-contain rounded-none hover:invert exclude-dark-mode"
              ></img>
            </a>
          </button>
          <button className="w-12 h-12">
            <a href="https://twitter.com/AlumniIit" target="_blank">
              {" "}
              <img
                src="/images/footer/X.png"
                className="w-full h-full object-contain rounded-none hover:invert exclude-dark-mode"
              ></img>{" "}
            </a>
          </button>
        </div>

        <h1 className="text-3xl md:text-5xl ml-0 md:ml-6 md:-mt-8">
          More Links
        </h1>
        <div className="flex flex-row gap-6 md:gap-12 w-full px-6 md:px-24 md:-mt-6 justify-center md:justify-start">
          <Link to="/">
            <button className="text-lg md:text-2xl hover:underline">
              Home
            </button>
          </Link>
          <Link to="/about">
            <button className="text-lg md:text-2xl hover:underline">
              About
            </button>
          </Link>
          <button className="text-lg md:text-2xl hover:underline">
            <a href="/team">Developers</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
