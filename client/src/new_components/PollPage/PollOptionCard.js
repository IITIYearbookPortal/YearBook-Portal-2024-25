import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import {Events} from './Events' ;
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
      navigate(`/comment/${user.name}/${user.roll_no}`);
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
  {/* Radio */}
  <label className="absolute top-2 left-2 z-30 flex items-center space-x-2 text-sm text-[#EEEEEE]">
    <input
      type="radio"
      value={option.option}
      checked={selectedOption === option.option}
      onChange={(e) => onSelectOption(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
    <span>{option.option}</span>
  </label>

  {/* User / Option Card */}
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
    <div className="w-full h-full bg-[#222831] flex items-center justify-center">
      <span className="text-xl text-[#EEEEEE]">{option.option}</span>
    </div>
  )}

  {/* Selection Indicator */}
  <div
    className={`absolute top-4 right-4 z-30 w-6 h-6 rounded-full border-2 
      ${isSelected
        ? 'border-[#76ABAE] bg-[#76ABAE]'
        : 'border-[#EEEEEE] group-hover:border-[#76ABAE]'
      }`}
  >
    {isSelected && (
      <motion.svg
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-full h-full p-1 text-[#222831]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          d="M20 6L9 17l-5-5"
        />
      </motion.svg>
    )}
  </div>

  {/* Bottom Name Bar */}
  <div className="absolute bottom-0 left-0 right-0 bg-[#222831]/90 p-3 z-20">
    <p className="text-lg font-semibold text-[#EEEEEE]">
      {isUser ? user?.name || option.option : `${user?.roll_no} - ${user?.name}`}
    </p>
    {!showDetails && (
      <p className="text-sm text-[#76ABAE]/80">Tap to view details</p>
    )}
  </div>

  {/* Details Overlay */}
  <AnimatePresence>
    {showDetails && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#222831]/95 backdrop-blur-sm z-40"
      >
        {/* details content stays SAME as yours */}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>

  );
};

export default PollOptionCard;