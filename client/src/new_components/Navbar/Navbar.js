import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LoginContext } from "../../helpers/Context";
import alumniData from "./akumniData.json";
import jwt_decode from "jwt-decode";
import logo from "./lo.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const { loggedin, profile } = useContext(LoginContext);

  // Fetch the current user
  let user = {};
  if (window.localStorage.getItem("token") !== null) {
    user = jwt_decode(window.localStorage.getItem("token"));
  }

  // Theme state and toggle logic
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode === "dark";
  });

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("themeMode", newMode ? "dark" : "light");
      window.location.reload(); // Force refresh to apply the theme
      return newMode;
    });
  };

  // Update links dynamically based on user state
  useEffect(() => {
    if (!loggedin && !profile.length) {
      setLinks([
        { name: "Home", path: "/" },
        { name: "Login", path: "/login" },
        { name: "More Links", path: "/footer" },
      ]);
    } else if (alumniData.includes(user.email)) {
      setLinks([
        { name: "Home", path: "/" },
        { name: "Search People", path: "/userlist" },
        {
          name: "My Profile",
          path: `/profile/${profile.roll_no}/${profile.name}`,
        },
        { name: "My Black Card", path: "/blackcard" },
        { name: "More Links", path: "/footer" },
        { name: "Logout", path: "/logout" },
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
        { name: "More Links", path: "/footer" },
        { name: "Logout", path: "/logout" },
      ]);
    }
  }, [loggedin, profile, user.email]);

  return (
    <nav className="top-4 text-white z-50 sticky">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
            <span className="text-xl tracking-tight">YearBook' 2025</span>
          </div>

          {/* Centered Links (Desktop View) */}
          <ul className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-12 text-base">
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
            <li>
              <button
                onClick={toggleTheme}
                className={`hover:text-lightgreen cursor-pointer ${
                  loggedin ? "text-sm" : "text-base"
                }`}
              >
                Change Theme
              </button>
            </li>
          </ul>

          {/* Sign In Button */}
          <div className="hidden lg:flex justify-end space-x-12 items-center bg-[#76ABAE] rounded-md">
            <a
              href={loggedin ? "/logout" : "/login"}
              className={`bg-gradient-to-r from-lightgrey to-neutral-100 px-3 py-2 rounded ${
                loggedin ? "text-sm" : "text-base"
              }`}
            >
              {loggedin ? "Logout" : "Sign In"}
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 w-full p-8 flex flex-col justify-center items-center lg:hidden backdrop-blur-sm">
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
              <li>
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`hover:text-lightgreen text-center ${
                    loggedin ? "text-sm" : "text-base"
                  }`}
                >
                  Change Theme
                </button>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href={loggedin ? "/logout" : "/login"}
                className={`bg-gradient-to-r from-lightgrey to-neutral-100 px-3 py-2 rounded ${
                  loggedin ? "text-sm" : "text-base"
                }`}
              >
                {loggedin ? "Logout" : "Sign In"}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
