import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const variants = {
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

export const MenuItem = ({ name, path, setIsOpen }) => {
  const handleClick = () => {
    setIsOpen();
  };

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="h-8 w-auto z-50 text-4xl hover:underline hover:text-5xl cursor-pointer"
    >
      <Link to={path} onClick={handleClick}>
        {name}
      </Link>
    </motion.li>
  );
};
