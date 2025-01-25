import React, { use } from "react";
import {Events} from './Events' ;

const PollOptionCard = ({ option, selectedOption, onSelectOption, user }) => {
  return (
    <div
      className={`bg-gray-100 rounded-md sm:rounded-lg p-3 sm:p-4 transition-all duration-300 hover:bg-gray-100 hover:translate-x-2 ${
        selectedOption === option.option ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
      }`}
    >
      <label className="flex items-center cursor-pointer space-x-2 sm:space-x-4 text-base sm:text-lg text-gray-700 w-full">
        <input
          type="radio"
          value={option.option}
          checked={selectedOption === option.option}
          onChange={(e) => onSelectOption(e.target.value)}
          className="text-center w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-indigo-500 cursor-pointer"
        />
        <span className="flex-grow hover:text-blue-600 transition-colors duration-300">
          {user?.name? user.name:option.option}
        </span>
      </label>

      {/* Display user data inside the card */}
      {user ? (
        <Events event={{
          image: user.profile_img ,// Replace with the actual image path
          rollNo: user.roll_no,
          name: user.name,
          branch: user.department,
          department: user.academic_program,
        }} />
      ) : (
        <div className="mt-2 p-2 bg-gray-200 rounded-lg">
          <p><strong>Name:</strong> {option.option}</p>
        </div>
      )}
    </div>
  );
};

export default PollOptionCard;