// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams,useNavigate } from "react-router-dom";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import styles from "./PollPage.module.css"; 

// // Register chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const generateColors = (count) => {
//     const colors = [];
//     for (let i = 0; i < count; i++) {
//       // Generate colors evenly spaced on the color wheel
//       const hue = (360 / count) * i; // Spread hues across the circle
//       colors.push(`hsl(${hue}, 70%, 50%)`); // Saturation: 70%, Lightness: 50%
//     }
//     return colors;
//   };

// const PollResultsPage = () => {
//   const { pollId } = useParams();
//   const [poll, setPoll] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(process.env.REACT_APP_API_URL + `/polls/results/${pollId}`)
//       .then((res) => {
//         setPoll(res.data.poll);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching poll results:", err);
//         setLoading(false);
//       });
//   }, [pollId]);

//   if (loading) {
//     return <div>Loading poll results...</div>;
//   }

//   if (!poll) {
//     return <div>No poll data available.</div>;
//   }

//   // Prepare data for the pie chart
//   const colors = generateColors(poll.options.length);
//   const data = {
//     labels: poll.options.map((option) => option.option),
//     datasets: [
//       {
//         label: "Votes",
//         data: poll.options.map((option) => option.voteCount),
//         backgroundColor: colors,
//         hoverBackgroundColor: colors,
//       },
//     ],
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>Poll Results</h1>
//       <h2>{poll.question}</h2>
//       <div style={{ marginBottom: "20px" }}>
//         {poll.options.map((option) => (
//           <div key={option._id} className={styles.pollOption}>
//             <strong>{option.option}</strong>: {option.voteCount} votes
//           </div>
//         ))}
//       </div>
//       <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
//         <Pie data={data} options={{ maintainAspectRatio: false }} />
//       </div>
//       <button
//         onClick={() => navigate("/polls")} // Navigate back to the polls page
//         style={{
//           marginTop: "20px",
//           padding: "10px 20px",
//           fontSize: "16px",
//           cursor: "pointer",
//           backgroundColor: "#4CAF50",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//         }}
//       >
//         Go Back to Polls Page
//       </button>
//     </div>
//   );
// };

// export default PollResultsPage;

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
import styles from "./PollPage.module.css"; // Import CSS Module
ChartJS.register(ArcElement, Tooltip, Legend);

// const PollResultsPage = () => {
//     const { loggedin, profile } = useContext(LoginContext);
//     const { pollId } = useParams(); // Get the poll ID from the URL
//     const [poll, setPoll] = useState(null);
//     const [results, setResults] = useState([]);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [message, setMessage] = useState("");
//     const [showPieChart, setShowPieChart] = useState(true);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchPollData();
//     }, [pollId]);
//     const fetchPollData = () => {
//         setLoading(true);
//         axios
//             .get(process.env.REACT_APP_API_URL + `/polls/results/${pollId}`)
//             .then((res) => {
//                 setPoll(res.data.poll);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error("Error fetching poll results:", err);
//                 setLoading(false);
//             });
//     }

//     const handleVoteSubmit = (pollId) => {
//         if (!selectedOption) {
//             toast.error("Please select an option to vote.", { autoClose: 2000 });
//             return;
//         }
//         console.log("submitting vote ", {
//             pollId,
//             option: selectedOption,
//             user: profile.email,
//         });

//         axios
//             .post(process.env.REACT_APP_API_URL + "/votePoll", {
//                 pollId,
//                 option: selectedOption,
//                 user: profile.email,
//             })
//             .then(() => {
//                 toast.success("Vote submitted successfully!", { autoClose: 2000 });
//                 selectedOption(null);
//                 fetchPollData();
//             })
//             .catch((err) => {
//                 console.error("Error submitting vote:", err);
//                 // setMessage("Failed to submit your vote. Please try again.");
//                 toast.error("Failed to submit your vote. Please try again.", {
//                     autoClose: 2000,
//                 });
//             });
//     };

//     // Prepare data for pie chart
//     const generateColors = (count) => {
//         const colors = [];
//         for (let i = 0; i < count; i++) {
//             // Generate colors evenly spaced on the color wheel
//             const hue = (360 / count) * i; // Spread hues across the circle
//             colors.push(`hsl(${hue}, 70%, 50%)`); // Saturation: 70%, Lightness: 50%
//         }
//         return colors;
//     };
//     if (loading) {
//         return <div>Loading poll results...</div>;
//     }

//     if (!poll) {
//         return <div>No poll data available.</div>;
//     }
//     const colors = generateColors(poll.options.length);
//     // const data = {
//     //     labels: results.map((result) => result.option),
//     //     datasets: [
//     //         {
//     //             data: results.map((result) => result.voteCount),
//     //             backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
//     //         },
//     //     ],
//     // };
//     const data = {
//         labels: poll.options.map((option) => option.option),
//         datasets: [
//             {
//                 label: "Votes",
//                 data: poll.options.map((option) => option.voteCount),
//                 backgroundColor: colors,
//                 hoverBackgroundColor: colors,
//             },
//         ],
//     };

//     return (
//         <div style={{ textAlign: "center" }}>
//             <ToastContainer />
//             <h1>{poll.question}</h1>
//             {poll.options.map((option) => (
//                 <div key={option._id} className={styles.pollOption}>
//                     <label className={styles.pollOptionLabel}>
//                         <input
//                             type="radio"
//                             value={option.option}
//                             checked={selectedOption === option.option}
//                             onChange={(e) => setSelectedOption(e.target.value)}
//                             className={styles.pollOptionInput}
//                         />
//                         <span>{option.option}</span>
//                     </label>
//                 </div>
//             ))}
//             <button onClick={handleVoteSubmit} style={buttonStyles}>
//                 Submit Vote
//             </button>

//             <div style={{ textAlign: "center", marginTop: "40px" }}>
//                 <h2>Poll Results</h2>
//                 <div style={{ marginBottom: "20px" }}>
//                     {poll.options.map((option) => (
//                         <div key={option._id}>
//                             <strong>{option.option}</strong>: {option.voteCount} votes
//                         </div>
//                     ))}
//                 </div>
//                 <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
//                     <Pie data={data} options={{ maintainAspectRatio: false }} />
//                 </div>
//             </div>

//             <button
//                 onClick={() => navigate("/polls")}
//                 style={{
//                     marginTop: "20px",
//                     padding: "10px 20px",
//                     fontSize: "16px",
//                     cursor: "pointer",
//                     backgroundColor: "#4CAF50",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "5px",
//                 }}
//             >
//                 Go Back to Polls Page
//             </button>
//         </div>
//     );
// };
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
      return <div>Loading poll results...</div>;
    }
  
    // No poll found
    if (!poll) {
      return <div>No poll data available.</div>;
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
    
  
    return (
        <div className={styles.pollContainer}>
            <ToastContainer />
          <div className={styles.pollBox}>
            <h1 className={styles.pollQuestion}>{poll.question}</h1>
            <div className={styles.pollOptions}>
              {poll.options.map((option) => (
                <div key={option._id} className={styles.pollOption}>
                  <label className={styles.pollOptionLabel}>
                    <input
                      type="radio"
                      value={option.option}
                      checked={selectedOption === option.option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className={styles.pollOptionInput}
                    />
                    <span>{option.option}</span>
                  </label>
                </div>
              ))}
            </div>
            <button onClick={handleVoteSubmit} className={styles.submitButton}>
              Submit Vote
            </button>
            {message && <p className={styles.errorMessage}>{message}</p>}
          </div>
    
          <button
            onClick={() => setShowPieChart(!showPieChart)}
            className={styles.toggleButton}
          >
            {showPieChart ? "Hide Results" : "View Results"}
          </button>
    
          {showPieChart && (
            <div className={styles.resultsBox}>
              <h2>Poll Results</h2>
              <div className={styles.pollResults}>
                {poll.options.map((option) => (
                  <div key={option._id}>
                    <strong>{option.option}</strong>: {option.voteCount} votes
                  </div>
                ))}
              </div>
              <div className={styles.chartContainer}>
                <Pie data={data} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          )}
    
          <button onClick={() => navigate("/polls")} className={styles.backButton}>
            Go Back to Polls Page
          </button>
        </div>
      );
  };
  
  
  
const buttonStyles = {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};

export default PollResultsPage;
