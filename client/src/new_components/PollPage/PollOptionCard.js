import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Events } from "./Events";

const PollOptionCard = ({ option, selectedOption, onSelectOption, user, isUser }) => {
  const navigate = useNavigate();
  const isSelected = selectedOption === option.option;
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = () => {
    if (showDetails) {
      onSelectOption(option.option);
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (user?.roll_no && user?.name) {
      navigate(`/comment/${user.name}/${user.roll_no}`);
    }
  };

  return (
    <motion.div
      className={`relative h-[450px] w-full rounded-2xl overflow-hidden cursor-pointer bg-[#222831] shadow-2xl
        transition-all duration-500 group border-2
        ${isSelected ? "border-[#76ABAE] ring-4 ring-[#76ABAE]/20" : "border-white/5 hover:border-[#76ABAE]/50"}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
    >
      {/* Radio */}
      <label className="absolute top-0 left-0 z-40 flex items-center cursor-pointer space-x-4 text-lg text-[#EEEEEE] w-full p-4 bg-gradient-to-b from-black/80 to-transparent">
        <input
          type="radio"
          value={option.option}
          checked={isSelected}
          onChange={(e) => onSelectOption(e.target.value)}
          className="w-5 h-5 accent-[#76ABAE] cursor-pointer"
        />
        <span className="flex-grow font-medium drop-shadow-md">
          {option.option}
        </span>
      </label>

      {/* User Event */}
      {user ? (
        <div className="absolute top-16 left-4 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <Events
            event={{
                image: user.profile_img,
                rollNo: user.roll_no,
                name: user.name,
                branch: user.department,
                department: user.academic_program,
            }}
            />
        </div>
      ) : (
        <div className="absolute top-16 left-4 z-30 p-2 bg-[#31363F]/90 backdrop-blur-md rounded-lg text-white text-xs">
          <p><strong>Name:</strong> {option.option}</p>
        </div>
      )}

      {/* Selection Indicator */}
      <div
        className={`absolute top-4 right-4 z-50 w-8 h-8 rounded-full border-2 flex items-center justify-center
          ${isSelected
            ? "border-[#76ABAE] bg-[#76ABAE]"
            : "border-[#EEEEEE]/50 bg-black/20 backdrop-blur-sm"
          } transition-all duration-300`}
      >
        {isSelected && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 text-[#222831]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
              d="M20 6L9 17l-5-5"
            />
          </motion.svg>
        )}
      </div>

      {/* Main Content */}
      <div className="relative h-full w-full">
        <div className="absolute inset-0 h-full w-full">
          {user ? (
            <img
              src={user.profile_img}
              alt={user.name || option.option}
              className={`w-full h-full object-cover transition-transform duration-700 
                ${isSelected ? "scale-105" : "scale-100"}`}
            />
          ) : (
            <div className="w-full h-full bg-[#31363F] flex items-center justify-center">
              <span className="text-4xl font-bold text-[#EEEEEE]/10">{option.option}</span>
            </div>
          )}

          {isSelected && <div className="absolute inset-0 bg-[#76ABAE]/10 border-4 border-[#76ABAE] inset-0" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#222831] via-transparent to-transparent opacity-90" />
        </div>

        {/* Name Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <p className="text-xl font-bold text-[#EEEEEE] tracking-tight">
            {isUser ? user?.name || option.option : `${user.roll_no} — ${user.name}`}
          </p>
          {!showDetails && (
            <p className="text-sm font-medium text-[#76ABAE] mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76ABAE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#76ABAE]"></span>
              </span>
              Click to see profile details
            </p>
          )}
        </div>

        {/* Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-40 bg-[#222831]/90 backdrop-blur-md flex flex-col justify-center p-8"
            >
              {user && (
                <>
                  <h3 className="text-2xl font-bold text-center text-[#EEEEEE] border-b border-[#76ABAE]/30 pb-4 mb-6">
                    {user.name}
                  </h3>

                  <div className="flex-grow space-y-4 text-[#EEEEEE]">
                    <div className="flex flex-col">
                        <span className="text-[#76ABAE] text-xs font-bold uppercase tracking-widest">Roll Number</span>
                        <p className="text-lg">{user.roll_no}</p>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#76ABAE] text-xs font-bold uppercase tracking-widest">Department</span>
                        <p className="text-lg">{user.department}</p>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#76ABAE] text-xs font-bold uppercase tracking-widest">Program</span>
                        <p className="text-lg">{user.academic_program}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 mt-6 rounded-xl font-bold text-sm tracking-widest uppercase
                      ${isUser ? "bg-[#76ABAE] text-[#222831] shadow-lg shadow-[#76ABAE]/20" : "bg-[#31363F] text-gray-500 cursor-not-allowed"}`}
                    onClick={handleProfileClick}
                    disabled={!isUser}
                  >
                    View Full Profile
                  </motion.button>
                  <p className="text-center text-[#EEEEEE]/40 text-[10px] mt-4 uppercase">Tap again to confirm selection</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PollOptionCard;