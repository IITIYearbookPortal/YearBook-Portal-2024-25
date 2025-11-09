import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../helpers/Context";
import alumniData from "./akumniData.json";
import axios from "axios";
import jwt_decode from "jwt-decode";

const variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    opacity: 1,
    y: -20,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const variants2 = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

function Navigation({ isOpen, setIsOpen }) {
  const [links, setLinks] = useState([]);
  let user = {};

  if (window.localStorage.getItem("token") !== null) {
    user = jwt_decode(window.localStorage.getItem("token"));
  }

  const { loggedin, profile } = useContext(LoginContext);

  useEffect(() => {
    if (isOpen) {
      if (!loggedin && !profile.length) {
        setLinks([
          { name: "Home", path: "/" },
          //  { name: "Change Theme", path: "/changetheme" },
          { name: "Login", path: "/login" },
          { name: "More Links", path: "/footer" },
        ]);
      } else {
        if (alumniData.includes(user.email)) {
          setLinks([
            { name: "Home", path: "/" },
            { name: "Search People", path: "/userlist" },
            {
              name: "My Profile",
              path: `/profile/${profile.roll_no}/${profile.name}`,
            },
            { name: "My Black Card", path: "/blackcard" },
            //  { name: "Change Theme", path: "/changetheme" },
            { name: "More Links", path: "/footer" },
            // { name: "Logout", path: "/logout" },
          ]);
        } else {
          setLinks([
            { name: "Home", path: "/" },
            { name: "Search People", path: "/userlist" },
            {
              name: "My Profile",
              path: `/profile/nongrad/${user.name}/${user.email}`,
            },
            { name: "My Souvenir", path: "/goldcard" },
            // { name: "Change Theme", path: "/changetheme" },
            { name: "More Links", path: "/footer" },
            // { name: "Logout", path: "/logout" },
          ]);
        }
      }
    } else {
      const delay = setTimeout(() => {
        setLinks([]);
      }, 500); //

      return () => clearTimeout(delay);
    }
  }, [isOpen, loggedin, profile]);

  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //   const storedThemeMode = localStorage.getItem("themeMode");
  //   return storedThemeMode === "dark";
  // });

  // useEffect(() => {}, [isDarkMode]);

  // const toggleTheme = () => {
  //   setIsDarkMode((prevMode) => {
  //     const newMode = !prevMode;
  //     localStorage.setItem("themeMode", newMode ? "dark" : "light");
  //     window.location.reload();
  //     return newMode;
  //   });
  // };

  return (
    <motion.ul
      className="z-40 p-6 absolute bottom-12 w-full flex flex-col justify-center items-start"
      variants={variants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      {links.map((link, index) => (
        <MenuItem
          key={index}
          name={link.name}
          path={link.path}
          setIsOpen={setIsOpen}
        />
      ))}
      {/* <motion.li
        variants={variants2}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="h-8 w-auto z-50 text-4xl hover:underline hover:text-5xl cursor-pointer"
      >
        <button onClick={toggleTheme}>Change Theme</button>
      </motion.li> */}
    </motion.ul>
  );
}
export { Navigation };
