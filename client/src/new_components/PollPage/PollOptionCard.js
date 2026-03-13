import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Events } from "./Events";

const PollOptionCard = ({
  option,
  selectedOption,
  onSelectOption,
  user,
  isUser,
  hasVoted
}) => {
  const navigate = useNavigate();
  const isSelected = selectedOption === option.option;
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = () => {
    if (hasVoted) return; // Prevent voting again
    if (showDetails) {
      onSelectOption(option.option);
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (user?.email && user?.name) {
      navigate(`/comment/${user.name}/${user.email}`);
    }
  };

  return (
    <motion.div
      className={`relative h-[300px] w-full rounded-lg overflow-hidden cursor-pointer bg-[#31363F] shadow-lg
      transition-all duration-300 group
      ${isSelected ? "ring-4 ring-[#76ABAE] scale-[1.02]" : "hover:ring-2 hover:ring-[#76ABAE]/50"}
      ${hasVoted ? "opacity-80 cursor-not-allowed" : ""}`}
      whileHover={{ scale: hasVoted ? 1 : 1.02 }}
      whileTap={{ scale: hasVoted ? 1 : 0.98 }}
      onClick={handleCardClick}
    >
      {/* Selection Indicator */}
      <div
        className={`absolute top-4 right-4 z-30 w-6 h-6 rounded-full border-2 
        ${isSelected
            ? "border-[#76ABAE] bg-[#76ABAE]"
            : "border-white group-hover:border-[#76ABAE]"
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

      {/* Fullscreen Image Background */}
      <div className="absolute inset-0">
        {user ? (
          <img
            src={user.profile_img}
            alt={user.name || option.option}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#222831] flex items-center justify-center">
            <span className="text-xl text-white">{option.option}</span>
          </div>
        )}

        {isSelected && (
          <div className="absolute inset-0 bg-black/40" />
        )}
      </div>

      {/* Name Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#222831]/90 p-3 z-20">
        <p className="text-lg font-semibold text-white">
          {isUser
            ? user?.name || option.option
            : `${user?.email || ""} - ${user?.name || ""}`}
        </p>

        {!showDetails && (
          <p className="text-sm text-[#76ABAE]/80">
            {hasVoted ? "You voted for this option" : "Tap to view details"}
          </p>
        )}
      </div>

      {/* Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#222831]/95 backdrop-blur-sm flex flex-col p-4 z-30"
          >
            {user && (
              <>
                <h3 className="text-xl font-bold text-center text-white">
                  {user.name}
                </h3>

                <div className="flex-grow space-y-2 mt-4 text-sm text-white">
                  <p>
                    <span className="text-[#76ABAE]">Email:</span>{" "}
                    {user.email}
                  </p>
                  <p>
                    <span className="text-[#76ABAE]">Department:</span>{" "}
                    {user.department}
                  </p>
                  <p>
                    <span className="text-[#76ABAE]">Program:</span>{" "}
                    {user.academic_program}
                  </p>
                </div>

                <motion.button
                  className={`w-full py-2 rounded-lg font-medium
                  ${isUser
                      ? "bg-[#76ABAE] text-[#222831]"
                      : "bg-[#76ABAE]/30 cursor-not-allowed"
                    }`}
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
    </motion.div>
  );
};

export default PollOptionCard;