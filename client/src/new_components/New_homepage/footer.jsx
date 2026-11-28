import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, MapPin, Mail, Phone, Linkedin, Instagram, Youtube } from 'lucide-react';
import "./homepage.module.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";

const Footer = ({ topColor }) => {
  const {loggedin,setLoggedin} = useContext(LoginContext);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedThemeMode = localStorage.getItem("themeMode");
    return storedThemeMode === "dark";
  });
  const WaveTop = () => {
    return (
      <div className="w-full overflow-hidden bg-transparent">
        <svg
          className="w-full h-24 block"
          viewBox="0 -2 1440 102"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="greenOverlay" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EEEEEE" />
              <stop offset="100%" stopColor="#76ABAE" />
            </linearGradient>
            <linearGradient id="waveStrokeSubtle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EEEEEE" stopOpacity="0.16" />
              <stop offset="50%" stopColor="#76ABAE" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#EEEEEE" stopOpacity="0.14" />
            </linearGradient>
          </defs>
          {topColor && (
            <path
              d="M0,0 
                 C240,95 480,95 720,45 
                 C960,-5 1200,-5 1440,45 
                 L1440,-2 L0,-2 Z"
              fill={topColor}
            />
          )}
          <path
            d="M0,0 
               C240,95 480,95 720,45 
               C960,-5 1200,-5 1440,45 
               L1440,100 L0,100 Z"
            fill="#000000"
          />
          <path
            d="M0,0 
               C240,95 480,95 720,45 
               C960,-5 1200,-5 1440,45"
            fill="none"
            stroke="url(#waveStrokeSubtle)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  };
  
  return (
      <footer className="text-xl bg-transparent text-white relative">
      <WaveTop />

      <div className="w-full bg-[#000000] px-6 sm:px-10 lg:px-16 pt-10 sm:pt-12 pb-16">
        {/* Main Footer Content */}
        <div className="max-w-screen-2xl mx-auto">
        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* Institute Section */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold">Yearbook 2027</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              Preserving memories and celebrating achievements of the graduating class of IIT Indore.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-yellow-400">Quick Links</h4>
            <ul className="flex flex-col items-start space-y-3 text-base sm:text-lg">
              <li>
                <a
                  href="https://alumni.iiti.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Alumni Portal
                </a>
              </li>
              <li>
                <a
                  href="https://alumnicell.iiti.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Alumni Cell Portal
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/team" className="text-gray-300 hover:text-white transition-colors">
                Developers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-yellow-400">Contact Us</h4>
            <ul className="flex flex-col items-start space-y-3.5 text-base sm:text-lg">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                <span className="text-gray-300 leading-relaxed">
                  IIT Indore, Khandwa Road, Simrol, Indore 453552
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <a href="mailto:alumnicell@iiti.ac.in" className="text-gray-300 hover:text-white transition-colors">
                  alumnicell@iiti.ac.in
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <a href="tel:+917312438700" className="text-gray-300 hover:text-white transition-colors">
                  +91 8391973739 
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-yellow-400">Connect With Us</h4>
            <div className="flex space-x-4 pt-1">
              <a
                href="https://www.linkedin.com/company/alumni-cell-iit-indore/"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/alumni_cell_iiti/"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@AlumniCorporateRelationsIITInd"
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Bottom Section */}
        <div className="text-center space-y-4">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Alumni Cell, IIT Indore. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            "Every end is just a new beginning. The memories we've made here will forever be our guiding light."
          </p>
        </div>
        </div>
      </div>
    </footer>
  
  );
};

export default Footer;
