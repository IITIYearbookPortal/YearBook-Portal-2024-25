import React, {useState} from "react";
import { useRef } from "react";
import { motion, sync, useCycle } from "framer-motion";
// import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import { LoginContext } from "../../helpers/Context";
import { useContext, useEffect } from "react";
import alumniData from "./akumniData.json";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const Navbar = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  // const { height } = useDimensions(containerRef);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode === "dark";
  });
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      ref={containerRef}
      className={
        isOpen
          ? "fixed top-0 left-0 w-72 h-screen z-40"
          : "fixed top-0 left-0 w-12 h-screen z-40 transition-all duration-300 delay-700"
      }
    >
      <motion.div
        className={`absolute w-screen h-screen z-30 flex flex-col justify-center ${isDarkMode ? 'bg-nav-dark text-white' : 'bg-nav-light'}`}
        variants={sidebar}
      />
      <Navigation isOpen={isOpen} setIsOpen={toggleOpen} />
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};

export default Navbar;
