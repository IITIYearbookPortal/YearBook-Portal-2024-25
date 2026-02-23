import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LoginContext } from "../../helpers/Context";
import alumniData from "./akumniData.json";
import jwt_decode from "jwt-decode";
import logo from "./lo.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { loggedin, profile } = useContext(LoginContext);

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwt_decode(token);
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const decoded = jwt_decode(token);
      setUser(decoded);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [loggedin]);

  const getLinks = () => {
    if (!loggedin) {
      return [
        { name: "Home", path: "/" },
        { name: "Previous Year Book", path: "/previous-yrbook" },
        { name: "Login", path: "/login" },
        { name: "More Links", path: "/footer" },
      ];
    }

    if (!user) return [];

    if (alumniData.includes(user.email)) {
      return [
        { name: "Home", path: "/" },
        { name: "Search People", path: "/userlist" },
        { name: "Polls", path: "/polls" },
        {
          name: "My Profile",
          path: `/profile/${profile?.roll_no}/${profile?.name}`,
        },
        { name: "Previous Year Book", path: "/previous-yrbook" },
        { name: "Memory Map", path: "/memory" },
        { name: "More Links", path: "/footer" },
        { name: "Logout", path: "/logout" },
      ];
    }

    return [
      { name: "Home", path: "/" },
      { name: "Search People", path: "/userlist" },
      { name: "Previous Year Book", path: "/previous-yrbook" },
      {
        name: "My Profile",
        path: `/profile/nongrad/${user.name}/${user.email}`,
      },
      { name: "My Souvenir", path: "/goldcard" },
      { name: "More Links", path: "/footer" },
      { name: "Logout", path: "/logout" },
    ];
  };

  const links = getLinks();

  return (
    <nav className="text-white z-50 sticky bg-black bg-opacity-50">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center flex-shrink-0">
            <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
            <span className="text-xl tracking-tight">YearBook' 2026</span>
          </div>

          <ul className="absolute left-[55%] font-bold transform -translate-x-1/2 hidden lg:flex space-x-12 text-base ml-2">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.path}
                  className={`hover:text-lightgreen ${loggedin ? "text-sm" : "text-base"}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {!loggedin && (
            <div className="hidden lg:flex justify-end space-x-12 items-center bg-green-400 rounded-md">
              <a
                href="/login"
                className={`bg-gradient-to-r from-lightgrey to-neutral-100 px-3 py-2 rounded ${
                  loggedin ? "text-sm" : "text-base"
                }`}
              >
                Sign Up
              </a>
            </div>
          )}

          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-16 w-full z-50 left-0 p-8 flex flex-col justify-center items-center lg:hidden backdrop-blur-sm bg-black/30">
            <ul className="flex flex-col space-y-6 items-center">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className={`hover:text-lightgreen text-center ${
                      loggedin ? "text-sm" : "text-base"
                    }`}
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