import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PollOptionCard from "./PollOptionCard";
import { motion, AnimatePresence } from "framer-motion";

// Add this helper function at the top of your component
const splitOptionData = (combinedOption) => {
  const [rollNo, name] = combinedOption.split(" - ");
  return { rollNo, name };
};

const PollResultsPage = () => {
  const { loggedin, profile } = useContext(LoginContext);
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPollData();
  }, [pollId]);

  useEffect(() => {
    if (poll && poll.options && poll.options.length > 0) {
      fetchUserData(poll.options); // Only fetch user data if poll options are populated
    }
  }, [poll]); // Dependency on the poll object

  const getPollData = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL + `/polls/results/${pollId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
          },
        }
      )
      .then((res) => {
        setPoll(res.data.poll);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching poll results:", err);
        setLoading(false);
      });
  };

  // Modify the fetchUserData function
  const fetchUserData = (options) => {
    if (Array.isArray(poll.options)) {
      const rollNumbers = options.map(
        (option) => splitOptionData(option.option).rollNo
      );
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/getUsersData`,
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
            },
          }
        )
        .then((response) => {
          const filteredUsers1 = response.data.filter((user) =>
            rollNumbers.includes(user.roll_no)
          );
          setFilteredUsers(filteredUsers1);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  };

  const handleVoteSubmit = () => {
    if (!selectedOption) {
      setMessage("Please select an option to vote.");
      toast.error("Please select an option to vote.", { autoClose: 2000 });
      return;
    }

    axios
      .post(
        process.env.REACT_APP_API_URL + "/votePoll",
        {
          pollId,
          option: selectedOption,
          user: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
          },
        }
      )
      .then(() => {
        toast.success("Vote submitted successfully!", { autoClose: 2000 });
        setSelectedOption(null);
        setMessage("");
        getPollData(); // Refresh poll data after voting
      })
      .catch((err) => {
        console.error("Error submitting vote:", err);
        if (err.response?.data?.message) {
          toast.error(err.response.data.message, { autoClose: 2000 });
          setMessage(err.response.data.message);
        } else {
          toast.error("Failed to submit your vote. Please try again.", {
            autoClose: 2000,
          });
          setMessage("Failed to submit your vote. Please try again.");
        }
      });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#76ABAE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-[#EEEEEE]">Loading poll results...</p>
        </div>
      </div>
    );
  }

  // No poll found
  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#222831]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-[#31363F] rounded-xl shadow-lg p-8 max-w-md w-full"
        >
          <svg
            className="w-16 h-16 text-[#76ABAE] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xl text-[#EEEEEE] mb-4">No poll data available</p>
          <button
            onClick={() => navigate("/polls")}
            className="px-6 py-2 bg-[#76ABAE] text-[#222831] rounded-lg hover:bg-[#76ABAE]/90 transition-colors duration-300 font-medium"
          >
            Return to Polls
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222831] py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-[#EEEEEE] text-center mb-12">
          {poll.question}
        </h1>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        >
          {poll.options.map((option) => {
            const { rollNo, name } = splitOptionData(option.option);
            const user = filteredUsers.find((user) => user.roll_no === rollNo);

            return (
              <motion.div
                key={option._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <PollOptionCard
                  option={{
                    ...option,
                    displayName: user ? user.name : name, // Use database name if found, otherwise use the name from poll
                  }}
                  selectedOption={selectedOption}
                  onSelectOption={setSelectedOption}
                  user={user || { name: name, roll_no: rollNo }} // Provide fallback user object
                  isUser={!!user} // Check if user is found in filteredUsers
                />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full max-w-2xl mx-auto block px-8 py-3 rounded-lg text-[#222831] font-medium shadow-md 
            transition-colors duration-300 ${
              !selectedOption
                ? "bg-[#31363F] text-[#EEEEEE]/50 cursor-not-allowed"
                : "bg-[#76ABAE] hover:bg-[#76ABAE]/90 text-[#222831]"
            }`}
          onClick={handleVoteSubmit}
          disabled={!selectedOption}
        >
          {selectedOption ? "Submit Vote" : "Select an option to vote"}
        </motion.button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
          >
            {message}
          </motion.div>
        )}

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/polls")}
          className="w-full max-w-2xl mx-auto mt-8 px-8 py-3 bg-[#31363F] text-[#EEEEEE] rounded-lg font-medium 
            shadow-md hover:bg-[#31363F]/90 transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Polls</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PollResultsPage;
