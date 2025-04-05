import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const PollOptionCard = ({ option, selectedOption, onSelectOption, user,isUser }) => {
  const navigate = useNavigate();
  const isSelected = selectedOption === option.option;
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = (e) => {
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
      navigate(`/comment/${user.roll_no}/${user.name}`);
    }
  };

  return (
    <motion.div
      className={`relative h-[300px] w-full rounded-lg overflow-hidden cursor-pointer bg-[#31363F] shadow-lg
        transition-all duration-300 group
        ${isSelected ? 'ring-4 ring-[#76ABAE] scale-[1.02]' : 'hover:ring-2 hover:ring-[#76ABAE]/50'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
    >
      {/* Selection Indicator */}
      <div
        className={`absolute top-4 right-4 z-30 w-6 h-6 rounded-full border-2 
          ${isSelected
            ? 'border-[#76ABAE] bg-[#76ABAE]'
            : 'border-[#EEEEEE] group-hover:border-[#76ABAE]'
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
          {/*dark over when selected*/}
          {isSelected && (
            <div className="absolute inset-0 bg-[#222831]/40 pointer-events-none" />
          )}
        </div>

        {/* Name Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#222831]/90 p-3">
        <p className="text-lg font-semibold text-[#EEEEEE]">
  {isUser 
    ? user?.name || option.option
    : `${user.roll_no} - ${user.name}`
  }
</p>
          {!showDetails && (
            <p className="text-sm text-[#76ABAE]/80">
              Tap to view details
            </p>
          )}
        </div>

        {/* Details Overlay */}
        <AnimatePresence>
          {(showDetails || false) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 backdrop-blur-sm flex flex-col
                ${isSelected ? 'bg-[#222831]/95' : 'bg-gradient-to-b from-[#222831]/90 to-[#222831]/95'}`}
            >
              {user ? (
                <div className="h-full flex flex-col p-4">
                  <div className="text-center border-b border-[#76ABAE]/20 pb-2">
                    <h3 className="text-xl font-bold text-[#EEEEEE]">
                      {user.name}
                    </h3>
                  </div>

                  <div className="flex-grow py-3 space-y-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#76ABAE]" />
                      <p className="text-[#EEEEEE] text-sm">
                        <span className="text-[#76ABAE]">Roll No:</span> {user.roll_no}
                      </p>
                    </div>
                    {user.department && (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#76ABAE]" />
                        <p className="text-[#EEEEEE] text-sm">
                          <span className="text-[#76ABAE]">Department:</span> {user.department}
                        </p>
                      </div>
                    )}
                    {user.academic_program && (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#76ABAE]" />
                        <p className="text-[#EEEEEE] text-sm">
                          <span className="text-[#76ABAE]">Program:</span> {user.academic_program}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* view profile button */}
                  <div className="mt-auto space-y-2">
                    <div className="border-t border-[#76ABAE]/20 pt-2">
                      <motion.button
                        className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2
                          ${isUser 
                            ? 'bg-[#76ABAE] text-[#222831] hover:bg-[#76ABAE]/90' 
                            : 'bg-[#76ABAE]/30 text-[#222831]/50 cursor-not-allowed'
                          } transition-colors duration-300`}
                        onClick={handleProfileClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!isUser}
                      >
                        <span>View Profile</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </motion.button>
                      <p className="text-sm text-center mt-2 pb-1">
                        <span className="text-[#76ABAE]">{isSelected ? 'Selected' : 'Tap again to select'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center p-6">
                  <p className="text-xl text-[#EEEEEE] text-center flex-grow flex items-center">
                    {option.option}
                  </p>
                  <p className="text-sm text-center pb-1">
                    <span className="text-[#76ABAE]">Tap again</span>
                    <span className="text-[#EEEEEE]"> to {isSelected ? 'unselect' : 'select'}</span>
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PollOptionCard;