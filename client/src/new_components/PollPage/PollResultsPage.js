import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PollOptionCard from "./PollOptionCard";
import { motion } from "framer-motion";

// Helper to split option string: "email - Name"
const splitOptionData = (combinedOption) => {
  const [email, name] = combinedOption.split(" - ");
  return { email, name };
};

const PollResultsPage = () => {
  const { loggedin, profile } = useContext(LoginContext);
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  useEffect(() => {
    if (poll?.options?.length) fetchUserData(poll.options);
  }, [poll]);

  const fetchPoll = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/polls/results/${pollId}`)
      .then(res => {
        setPoll(res.data.poll);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchUserData = (options) => {
    if (Array.isArray(poll.options)) {
      const rollNumbers = options.map(option => splitOptionData(option.option).rollNo);
      axios.get(`${process.env.REACT_APP_API_URL}/getUsersData`)
        .then(response => {
          const filteredUsers1 = response.data.filter(user =>
            rollNumbers.includes(user.roll_no)
          );
          setFilteredUsers(filteredUsers1);
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
        });
    }
  };

  const handleVoteSubmit = () => {
    if (!selectedOption) return;

    axios.post(`${process.env.REACT_APP_API_URL}/votePoll`, {
      pollId,
      option: selectedOption,
      user: profile.email, 
    })
      .then(() => {
        toast.success("Vote submitted successfully!", { autoClose: 2000 });
        setSelectedOption(null);
        fetchPoll();
      })
      .catch(err => {
        const msg = err.response?.data?.message || "Failed to submit vote";
        toast.error(msg, { autoClose: 2000 });
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#76ABAE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-[#EEEEEE]">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831]">
        <div className="text-center text-[#EEEEEE]">Poll not found</div>
      </div>
    );
  }

  // Check if current user already voted
  const hasVoted = !!poll.votes?.[profile.email];

  return (
    <div className="min-h-screen bg-[#222831] py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#EEEEEE] text-center mb-12">{poll.question}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {poll.options.map(option => {
            const { email, name } = splitOptionData(option.option);
            const user = filteredUsers.find(u => u.email === email);

            return (
              <PollOptionCard
                key={option._id}
                option={{ ...option, displayName: user?.name || name }}
                selectedOption={selectedOption}
                onSelectOption={setSelectedOption}
                user={user || { name, email }}
                isUser={!!user}
                hasVoted={hasVoted}
              />
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: hasVoted ? 1 : 1.02 }}
          whileTap={{ scale: hasVoted ? 1 : 0.98 }}
          onClick={handleVoteSubmit}
          disabled={hasVoted || !selectedOption}
          className={`w-full max-w-2xl mx-auto block px-8 py-3 rounded-lg text-[#222831] font-medium shadow-md
            ${hasVoted ? "bg-gray-700 cursor-not-allowed text-[#EEEEEE]" : "bg-[#76ABAE] hover:bg-[#76ABAE]/90"}`}
        >
          {hasVoted ? "You have already voted" : selectedOption ? "Submit Vote" : "Select an option"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/polls")}
          className="w-full max-w-2xl mx-auto block mt-4 px-8 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 text-[#EEEEEE] font-medium shadow-md"
        >
          Back to Polls
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PollResultsPage;