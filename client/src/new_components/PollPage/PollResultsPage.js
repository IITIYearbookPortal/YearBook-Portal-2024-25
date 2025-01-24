import { useParams } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "chart.js/auto"; // Automatically register the necessary components for chart.js
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ChartJS.register(ArcElement, Tooltip, Legend);

const PollResultsPage = () => {
  const { loggedin, profile } = useContext(LoginContext);
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPieChart, setShowPieChart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPollData();
  }, [pollId]);

  const getPollData = () => {
    axios
      .get(process.env.REACT_APP_API_URL + `/polls/results/${pollId}`)
      .then((res) => {
        setPoll(res.data.poll);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching poll results:", err);
        setLoading(false);
      });
  };

  const handleVoteSubmit = () => {
    if (!selectedOption) {
      setMessage("Please select an option to vote.");
      toast.error("Please select an option to vote.", { autoClose: 2000 });
      return;
    }

    axios
      .post(process.env.REACT_APP_API_URL + "/votePoll", {
        pollId,
        option: selectedOption,
        user: profile.email,
      })
      .then(() => {
        toast.success("Vote submitted successfully!", { autoClose: 2000 });
        setSelectedOption(null);
        setMessage("");
        getPollData(); // Refresh poll data after voting
      })
      .catch((err) => {
        console.error("Error submitting vote:", err);
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message, {
            autoClose: 2000,
          });
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
      <div className="max-w-3xl min-h-screen mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading poll results...</p>
        </div>
      </div>
    );
  }

  // No poll found
  if (!poll) {
    return (
      <div className="max-w-3xl min-h-screen mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-gray-700">No poll data available</p>
          <button
            onClick={() => navigate("/polls")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Return to Polls
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for the pie chart
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (360 / count) * i;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  };

  const colors = generateColors(poll.options.length);
  const data = {
    labels: poll.options.map((option) => option.option),
    datasets: [
      {
        label: "Votes",
        data: poll.options.map((option) => option.voteCount),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  // Calculate total votes and percentages
  const totalVotes = poll?.options.reduce((sum, option) => sum + option.voteCount, 0) || 0;

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  // Sort options by vote count for better visualization
  const sortedOptions = [...poll.options].sort((a, b) => b.voteCount - a.voteCount);
  const highestVotes = Math.max(...poll.options.map(option => option.voteCount));

  return (
    <div className="max-w-3xl min-h-screen mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <ToastContainer />
      <div className="bg-slate-300 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4 sm:mb-6 md:mb-8 leading-tight">
          {poll.question}
        </h1>
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
          {poll.options.map((option) => (
            <div
              key={option._id}
              className={`bg-gray-100 rounded-md sm:rounded-lg p-3 sm:p-4 transition-all duration-300 hover:bg-gray-100 hover:translate-x-2 ${selectedOption === option.option ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                }`}
            >
              <label className="flex items-center cursor-pointer space-x-2 sm:space-x-4 text-base sm:text-lg text-gray-700 w-full">
                <input
                  type="radio"
                  value={option.option}
                  checked={selectedOption === option.option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="text-center w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="flex-grow hover:text-blue-600 transition-colors duration-300">
                  {option.option}
                </span>
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={handleVoteSubmit}
          className="w-full py-3 sm:py-4 bg-green-600 text-sm sm:text-base text-white font-semibold rounded-md sm:rounded-lg shadow-md hover:bg-green-600 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mb-3 sm:mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedOption}
        >
          {selectedOption ? 'Submit Vote' : 'Select an option to vote'}
        </button>
        {message && (
          <div className="text-red-500 text-sm sm:text-base text-center mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 rounded-md sm:rounded-lg border border-red-200 animate-bounce">
            {message}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowPieChart(!showPieChart)}
        className="w-full py-2 sm:py-3 bg-blue-500 text-sm sm:text-base text-white font-medium rounded-md sm:rounded-lg shadow-md hover:bg-blue-600 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-3 sm:mb-4 flex items-center justify-center space-x-2"
      >
        <span>{showPieChart ? 'Hide Results' : 'View Results'}</span>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${showPieChart ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7m0 0l7-7 7 7" />
        </svg>
      </button>

      {showPieChart && (
        <div className="bg-slate-300 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-8 transform transition-all duration-500 animate-fade-in">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center mb-3 sm:mb-4 md:mb-6">
            Poll Results
          </h2>

          {/* Total Votes Summary */}
          <div className="bg-gray-100 rounded-md sm:rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <p className="text-sm sm:text-base text-gray-600">Total Votes</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{totalVotes}</p>
              </div>
              {sortedOptions[0]?.voteCount > 0 && (
                <div className="text-center">
                  <p className="text-sm sm:text-base text-gray-600">Leading Option</p>
                  <p className="text-xl sm:text-2xl font-bold text-indigo-600">{getPercentage(sortedOptions[0].voteCount)}%</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8">
            {sortedOptions.map((option, index) => {
              const isLeading = option.voteCount === highestVotes && option.voteCount > 0;
              const percentage = getPercentage(option.voteCount);

              return (
                <div
                  key={option._id}
                  className={`bg-gray-100 p-3 sm:p-4 rounded-md sm:rounded-lg hover:bg-gray-100 transition-all duration-300 ${isLeading ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
                    }`}
                >
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isLeading ? 'animate-pulse' : ''
                        }`} style={{ backgroundColor: colors[index] }}></div>
                      <strong className={`text-sm sm:text-base ${isLeading ? 'text-indigo-700' : 'text-gray-700'
                        }`}>{option.option}</strong>
                      {isLeading && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-xs sm:text-sm text-gray-500">{option.voteCount} votes</span>
                      <span className={`text-sm sm:text-base font-semibold ${isLeading ? 'text-indigo-600' : 'text-gray-600'
                        }`}>{percentage}%</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isLeading ? 'animate-pulse' : ''
                        }`}
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: colors[index]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-[250px] sm:h-[300px] md:h-[400px] p-2 sm:p-4">
            <Pie
              data={{
                labels: sortedOptions.map(option => option.option),
                datasets: [{
                  data: sortedOptions.map(option => option.voteCount),
                  backgroundColor: colors,
                  borderColor: colors.map(color => totalVotes === 0 ? color : `${color}99`),
                  borderWidth: 2,
                  hoverBorderWidth: 0,
                  hoverOffset: 4
                }]
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: window.innerWidth < 640 ? 12 : 20,
                      font: {
                        size: window.innerWidth < 640 ? 12 : 14
                      },
                      generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                          return data.labels.map((label, i) => ({
                            text: `${label} (${getPercentage(data.datasets[0].data[i])}%)`,
                            fillStyle: data.datasets[0].backgroundColor[i],
                            strokeStyle: data.datasets[0].borderColor[i],
                            lineWidth: data.datasets[0].borderWidth,
                            hidden: isNaN(data.datasets[0].data[i]) || data.datasets[0].data[i] === 0,
                            index: i
                          }));
                        }
                        return [];
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw;
                        const percentage = getPercentage(value);
                        return ` ${value} votes (${percentage}%)`;
                      }
                    }
                  }
                },
                animation: {
                  animateScale: true,
                  animateRotate: true
                }
              }}
            />
          </div>
        </div>
      )}
      <button
        onClick={() => navigate("/polls")}
        className="w-full py-2 sm:py-3 bg-gray-500 text-sm sm:text-base text-white font-medium rounded-md sm:rounded-lg shadow-md hover:bg-gray-600 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center space-x-2"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Polls</span>
      </button>
    </div>
  );
};

export default PollResultsPage;
