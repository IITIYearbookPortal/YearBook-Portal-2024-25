import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LoginContext } from "../../helpers/Context";
import axios from "axios";
import logo from "./lo.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { loggedin, profile, user } = useContext(LoginContext);

  const getLinks = () => {
    if (!loggedin) {
      return [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Team", path: "/team" },
        { name: "Login", path: "/login" },
        { name: "Links", path: "/footer" },
      ];
    }

    if (!user) return [];

    if (user.alumni) {
      return [
        { name: "Home", path: "/" },
        { name: "Friends", path: "/userlist" },
        { name: "Polls", path: "/polls" },
        {
          name: "Profile",
          path: `/profile/${profile?.roll_no}/${profile?.name}`,
        },
        { name: "Memories", path: "/memory" },
        { name: "Archive", path: "/previous-yrbook" },
        { name: "Links", path: "/footer" },
        { name: "Logout", path: "/logout" },
      ];
    }

    return [
      { name: "Home", path: "/" },
      { name: "Friends", path: "/userlist" },
      {
        name: "Profile",
        path: `/profile/nongrad/${user.name}/${user.email}`,
      },
      { name: "Souvenir", path: "/goldcard" },
      { name: "Archive", path: "/previous-yrbook" },
      { name: "Links", path: "/footer" },
      { name: "Logout", path: "/logout" },
    ];
  };

  const links = getLinks();

  return (
    <nav className="text-white z-50 relative bg-black/50 backdrop-blur-sm">
      {/* Adjust horizontal edge padding with px-6 sm:px-10 lg:px-16 */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between py-4 gap-10">
          <a
            href="/"
            className="inline-flex items-center flex-shrink-0 hover:opacity-90 transition-opacity"
          >
            <img src={logo} alt="logo" className="h-11 w-11 mr-3 rounded-full" />
            <span className="text-xl lg:text-2xl font-bold tracking-tight whitespace-nowrap">
              Yearbook'27
            </span>
          </a>

          {/* Adjust link spacing (gap-7 xl:gap-11 2xl:gap-14) and text size (text-base lg:text-lg) here */}
          <ul className="hidden lg:flex items-center justify-center mx-auto gap-7 xl:gap-11 2xl:gap-14 font-semibold text-base lg:text-lg whitespace-nowrap">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.path}
                  className="hover:text-lightgreen transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full w-full z-50 left-0 p-8 flex flex-col justify-center items-center lg:hidden backdrop-blur-md bg-[#111827]/90 border-b border-gray-700/70 shadow-2xl">
            <ul className="flex flex-col gap-6 items-center">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="hover:text-lightgreen text-center text-base font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
