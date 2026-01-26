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
      className={`relative h-[300px] w-full rounded-lg overflow-hidden cursor-pointer bg-[#31363F] shadow-lg
        transition-all duration-300 group
        ${isSelected ? "ring-4 ring-[#76ABAE] scale-[1.02]" : "hover:ring-2 hover:ring-[#76ABAE]/50"}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
    >
      {/* Radio */}
      <label className="flex items-center cursor-pointer space-x-4 text-lg text-gray-700 w-full p-2">
        <input
          type="radio"
          value={option.option}
          checked={isSelected}
          onChange={(e) => onSelectOption(e.target.value)}
          className="w-5 h-5 text-blue-600 cursor-pointer"
        />
        <span className="flex-grow hover:text-blue-600 transition-colors duration-300">
          {option.option}
        </span>
      </label>

      {/* User Event */}
      {user ? (
        <Events
          event={{
            image: user.profile_img,
            rollNo: user.roll_no,
            name: user.name,
            branch: user.department,
            department: user.academic_program,
          }}
        />
      ) : (
        <div className="mt-2 p-2 bg-gray-200 rounded-lg">
          <p>
            <strong>Name:</strong> {option.option}
          </p>
        </div>
      )}

      {/* Selection Indicator */}
      <div
        className={`absolute top-4 right-4 z-30 w-6 h-6 rounded-full border-2 
          ${isSelected
            ? "border-[#76ABAE] bg-[#76ABAE]"
            : "border-[#EEEEEE] group-hover:border-[#76ABAE]"
          } transition-all duration-300`}
      >
        {isSelected && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-full h-full text-[#222831] p-1"
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
        <div className="relative h-full">
          {user ? (
            <img
              src={user.profile_img}
              alt={user.name || option.option}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#222831] flex items-center justify-center">
              <span className="text-xl text-[#EEEEEE]">{option.option}</span>
            </div>
          )}

          {isSelected && <div className="absolute inset-0 bg-[#222831]/40" />}
        </div>

        {/* Name Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#222831]/90 p-3">
          <p className="text-lg font-semibold text-[#EEEEEE]">
            {isUser ? user?.name || option.option : `${user.roll_no} - ${user.name}`}
          </p>
          {!showDetails && (
            <p className="text-sm text-[#76ABAE]/80">Tap to view details</p>
          )}
        </div>

        {/* Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#222831]/95 backdrop-blur-sm flex flex-col p-4"
            >
              {user && (
                <>
                  <h3 className="text-xl font-bold text-center text-[#EEEEEE]">
                    {user.name}
                  </h3>

                  <div className="flex-grow space-y-2 mt-4 text-sm text-[#EEEEEE]">
                    <p><span className="text-[#76ABAE]">Roll No:</span> {user.roll_no}</p>
                    <p><span className="text-[#76ABAE]">Department:</span> {user.department}</p>
                    <p><span className="text-[#76ABAE]">Program:</span> {user.academic_program}</p>
                  </div>

                  <motion.button
                    className={`w-full py-2 rounded-lg font-medium
                      ${isUser ? "bg-[#76ABAE] text-[#222831]" : "bg-[#76ABAE]/30 cursor-not-allowed"}`}
                    onClick={handleProfileClick}
                    disabled={!isUser}
                  >
                    View Profile
                  </motion.button>
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
