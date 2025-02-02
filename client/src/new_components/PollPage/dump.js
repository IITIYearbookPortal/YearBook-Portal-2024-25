// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useParams,useNavigate } from "react-router-dom";
// // import { Pie } from "react-chartjs-2";
// // import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// // import styles from "./PollPage.module.css"; 

// // // Register chart.js components
// // ChartJS.register(ArcElement, Tooltip, Legend);

// // const generateColors = (count) => {
// //     const colors = [];
// //     for (let i = 0; i < count; i++) {
// //       // Generate colors evenly spaced on the color wheel
// //       const hue = (360 / count) * i; // Spread hues across the circle
// //       colors.push(`hsl(${hue}, 70%, 50%)`); // Saturation: 70%, Lightness: 50%
// //     }
// //     return colors;
// //   };

// // const PollResultsPage = () => {
// //   const { pollId } = useParams();
// //   const [poll, setPoll] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     axios
// //       .get(process.env.REACT_APP_API_URL + `/polls/results/${pollId}`)
// //       .then((res) => {
// //         setPoll(res.data.poll);
// //         setLoading(false);
// //       })
// //       .catch((err) => {
// //         console.error("Error fetching poll results:", err);
// //         setLoading(false);
// //       });
// //   }, [pollId]);

// //   if (loading) {
// //     return <div>Loading poll results...</div>;
// //   }

// //   if (!poll) {
// //     return <div>No poll data available.</div>;
// //   }

// //   // Prepare data for the pie chart
// //   const colors = generateColors(poll.options.length);
// //   const data = {
// //     labels: poll.options.map((option) => option.option),
// //     datasets: [
// //       {
// //         label: "Votes",
// //         data: poll.options.map((option) => option.voteCount),
// //         backgroundColor: colors,
// //         hoverBackgroundColor: colors,
// //       },
// //     ],
// //   };

// //   return (
// //     <div style={{ textAlign: "center" }}>
// //       <h1>Poll Results</h1>
// //       <h2>{poll.question}</h2>
// //       <div style={{ marginBottom: "20px" }}>
// //         {poll.options.map((option) => (
// //           <div key={option._id} className={styles.pollOption}>
// //             <strong>{option.option}</strong>: {option.voteCount} votes
// //           </div>
// //         ))}
// //       </div>
// //       <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
// //         <Pie data={data} options={{ maintainAspectRatio: false }} />
// //       </div>
// //       <button
// //         onClick={() => navigate("/polls")} // Navigate back to the polls page
// //         style={{
// //           marginTop: "20px",
// //           padding: "10px 20px",
// //           fontSize: "16px",
// //           cursor: "pointer",
// //           backgroundColor: "#4CAF50",
// //           color: "white",
// //           border: "none",
// //           borderRadius: "5px",
// //         }}
// //       >
// //         Go Back to Polls Page
// //       </button>
// //     </div>
// //   );
// // };

// // export default PollResultsPage;

// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import "chart.js/auto"; // Automatically register the necessary components for chart.js
// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { LoginContext } from "../../helpers/Context";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import styles from "./PollPage.module.css"; // Import CSS Module
// ChartJS.register(ArcElement, Tooltip, Legend);

// const PollResultsPage = () => {
//     const { loggedin, profile } = useContext(LoginContext);
//     const { pollId } = useParams(); // Get the poll ID from the URL
//     const [poll, setPoll] = useState(null);
//     const [results, setResults] = useState([]);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [message, setMessage] = useState("");
//     const [showPieChart, setShowPieChart] = useState(true);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         getpolldata();
//     }, [pollId]);
//     const getpolldata = () => {
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
//             setMessage("Please select an option to vote.");
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
//             })
//             .catch((err) => {
//                 console.error("Error submitting vote:", err);
//                 setMessage("Failed to submit your vote. Please try again.");
//             });
//     };

//     // Prepare data for pie chart
//     const data = {
//         labels: results.map((result) => result.option),
//         datasets: [
//             {
//                 data: results.map((result) => result.voteCount),
//                 backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
//             },
//         ],
//     };

//     return (
//         <div style={{ textAlign: "center" }}>
//             {poll && (
//                 <>
//                     <h1>{poll.question}</h1>
//                     {poll.options.map((option) => (
//                         <div key={option._id} className="poll-option">
//                             <label className="poll-option-label">
//                                 <input
//                                     type="radio"
//                                     value={option.option}
//                                     checked={selectedOption === option.option}
//                                     onChange={(e) => setSelectedOption(e.target.value)}
//                                     className="poll-option-input"
//                                 />
//                                 <span className="poll-option-text">{option.option}</span>
//                             </label>
//                         </div>
//                     ))}

//                     <button onClick={handleVoteSubmit} style={buttonStyles}>
//                         Submit Vote
//                     </button>
//                     {message && <p>{message}</p>}
//                     <div style={{ width: "300px", height: "300px", margin: "0 auto", marginTop: "30px" }}>
//                         <Pie data={data} />
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// const buttonStyles = {
//     padding: "10px 20px",
//     backgroundColor: "#007BFF",
//     color: "white",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
// };

// export default PollResultsPage;

// {---------------------------------}
// {---------------------------------}
// {---------------------------------}
// {---------------------------------}
// {---------------------------------}
// {---------------------------------}


// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { LoginContext } from "../../helpers/Context";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import styles from "./PollPage.module.css"; // Import CSS Module

// export function PollPage({ isDarkMode }) {
//   const { loggedin, profile, loading } = useContext(LoginContext);
//   const [polls, setPolls] = useState([]);
//   const [selectedPollOption, setSelectedPollOption] = useState(null);
//   const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
//   const [message, setMessage] = useState("");
//   const [failedPollId, setFailedPollId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !loggedin) {
//       navigate("/login");
//     }
//   }, [loggedin, loading, navigate]);

//   useEffect(() => {
//     axios
//       .get(process.env.REACT_APP_API_URL + "/polls")
//       .then((res) => setPolls(res.data.polls))
//       .catch((err) => console.error("Error fetching polls:", err));
//   }, []);

//   const handlePollSubmit = (e) => {
//     e.preventDefault();
//     if (!newPoll.question || newPoll.options.filter(Boolean).length < 2) {
//       setMessage("Please provide a valid poll question and at least two options.");
//       return;
//     }
    
//     axios
//       .post(process.env.REACT_APP_API_URL + "/createPoll", {
//         question: newPoll.question,
//         options: newPoll.options.filter(Boolean),
//         createdBy: profile.email,
//       })
//       .then((res) => {
//         toast.success("Poll created successfully!", { autoClose: 2000 });
//         setPolls([...polls, res.data.poll]);
//         setNewPoll({ question: "", options: ["", ""] });
//         setMessage("");
//       })
//       .catch((err) => {
//         console.error("Error creating poll:", err);
//         setMessage("Failed to create poll. Please try again.");
//       });
//   };

//   const handleVoteSubmit = (pollId) => {
//     if (!selectedPollOption) {
//       toast.error("Please select an option to vote.", {
//         position: "top-right", // Position of the toast
//         autoClose: 5000, // Time before toast auto closes (in ms)
//         hideProgressBar: false, // Show the progress bar
//         closeOnClick: true,
//         draggable: true,
//       });
//       return;
//     }
    
//     axios
//       .post(process.env.REACT_APP_API_URL + "/votePoll", {
//         pollId,
//         option: selectedPollOption,
//         user: profile.email,
//       })
//       .then(() => {
//         toast.success("Vote submitted successfully!", { autoClose: 2000 });
//         setSelectedPollOption(null);
//         setMessage("");
//         setFailedPollId(null);
//       })
//       .catch((err) => {
//         console.error("Error submitting vote:", err);
//         if (err.response && err.response.data && err.response.data.message) {
//           // Use the backend's message if available
//           setMessage(err.response.data.message);
//           setFailedPollId(pollId);
//         } else {
//           // Fallback to a generic error message
//           setMessage("Failed to submit your vote. Please try again.");
//           setFailedPollId(null);
//         }
//       });
//   };

//   // Handle poll deletion
//   const handleDeletePoll = (pollId) => {
//     console.log("deleting poll with id", pollId);
    
//     axios
//       .delete(process.env.REACT_APP_API_URL + `/polls/${pollId}`)
//       .then(() => {
//         toast.success("Poll deleted successfully!", { autoClose: 2000 });
//         setPolls(polls.filter((poll) => poll._id !== pollId)); // Remove the deleted poll from the state
//       })
//       .catch((err) => {
//         console.error("Error deleting poll:", err);
//         toast.error("Failed to delete poll. Please try again.");
//       });
//   };

//   return (
//     <div className={styles.pollPage}>
//       <ToastContainer />
//       <h1 className={styles.title}>Polls</h1>

//       <div className={styles.createPoll}>
//         <h2>Create a New Poll</h2>
//         <form onSubmit={handlePollSubmit}>
//           <input
//             type="text"
//             placeholder="Enter poll question"
//             value={newPoll.question}
//             onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
//             className={styles.input}
//           />
//           {newPoll.options.map((option, index) => (
//             <input
//               key={index}
//               type="text"
//               placeholder={`Option ${index + 1}`}
//               value={option}
//               onChange={(e) =>
//                 setNewPoll({
//                   ...newPoll,
//                   options: newPoll.options.map((opt, i) => (i === index ? e.target.value : opt)),
//                 })
//               }
//               className={styles.input}
//             />
//           ))}
//           <button
//             type="button"
//             onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
//             className={styles.button}
//           >
//             Add Option
//           </button>
//           <button type="submit" className={styles.button}>
//             Create Poll
//           </button>
//         </form>
       
//       </div>

//       <div className={styles.pollsList}>
//         <h2>Available Polls</h2>
//         {polls.length > 0 ? (
//           polls.map((poll) => (
//             <div key={poll._id} className={styles.pollCard}>
//               <p className={styles.pollQuestion}>{poll.question}</p>
//               <div className={styles.pollOptions}>
//                 {poll.options.map((optionObj, index) => (
//                   <label key={index}>
//                     <input
//                       type="radio"
//                       name={`poll-${poll._id}`}
//                       value={optionObj.option}
//                       onChange={() => setSelectedPollOption(optionObj.option)}
//                     />
//                     {optionObj.option}
//                   </label>
//                 ))}
//               </div>
//                {/* Display error or success message */}
//                 {failedPollId === poll._id && message && (
//                   <div
//                     style={{
//                       color: message.includes("successfully") ? "green" : "red",
//                       marginTop: "10px",
//                       fontSize: "16px",
//                     }}
//                   >
//                     {message}
//                   </div>
//                 )}
//               <div className={styles.buttonWrapper}>
//               <button onClick={() => handleVoteSubmit(poll._id)} className={styles.voteButton}>
//                 Vote
//               </button>
//               <button 
//                   onClick={() => navigate(`/poll/results/${poll._id}`)} 
//                   className={styles.viewResultsBtn}
//                 >
//                   View Results
//                 </button>

//               {/* Delete Button */}
//               {/* {profile.email === poll.createdBy && ( */}
//                 <button
//                   onClick={() => handleDeletePoll(poll._id)}
//                   className={styles.deleteButton}
//                 >
//                   Delete Poll
//                 </button>
//               {/* )} */}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No polls available at the moment.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PollPage;

// // import { useState, useContext, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { LoginContext } from "../../helpers/Context";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import styles from "./PollPage.module.css"; // Import CSS Module

// // export function PollPage({ isDarkMode }) {
// //   const { loggedin, profile, loading } = useContext(LoginContext);
// //   const [polls, setPolls] = useState([]);
// //   const [selectedPollOption, setSelectedPollOption] = useState(null);
// //   const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
// //   const [message, setMessage] = useState("");
// //   const navigate = useNavigate();
// //   console.log("hi",profile.email);
  

// //   useEffect(() => {
// //     if (!loading && !loggedin) {
// //       navigate("/login");
// //     }
// //   }, [loggedin, loading, navigate]);

// //   useEffect(() => {
// //     axios
// //       .get(process.env.REACT_APP_API_URL + "/polls")
// //       .then((res) => setPolls(res.data.polls))
// //       .catch((err) => console.error("Error fetching polls:", err));
// //   }, []);

// //   const handlePollSubmit = (e) => {
// //     e.preventDefault();
// //     if (!newPoll.question || newPoll.options.filter(Boolean).length < 2) {
// //       setMessage("Please provide a valid poll question and at least two options.");
// //       return;
// //     }
// //     console.log("creating poll with ",{
// //       question: newPoll.question,
// //       options: newPoll.options.filter(Boolean),
// //       createdBy: profile.email,
// //     });
    
// //     axios
// //       .post(process.env.REACT_APP_API_URL + "/createPoll", {
// //         question: newPoll.question,
// //         options: newPoll.options.filter(Boolean),
// //         createdBy: profile.email,
// //       })
// //       .then((res) => {
// //         toast.success("Poll created successfully!", { autoClose: 2000 });
// //         setPolls([...polls, res.data.poll]);
// //         setNewPoll({ question: "", options: ["", ""] });
// //         setMessage("");
// //       })
// //       .catch((err) => {
// //         console.error("Error creating poll:", err);
// //         setMessage("Failed to create poll. Please try again.");
// //       });
// //   };

// //   const handleVoteSubmit = (pollId) => {
// //     if (!selectedPollOption) {
// //       setMessage("Please select an option to vote.");
// //       return;
// //     }
// //     console.log("submitting vote ",{
// //       pollId,
// //       option: selectedPollOption,
// //       user: profile.email,
// //     });
    
// //     axios
// //       .post(process.env.REACT_APP_API_URL + "/votePoll", {
// //         pollId,
// //         option: selectedPollOption,
// //         user: profile.email,
// //       })
// //       .then(() => {
// //         toast.success("Vote submitted successfully!", { autoClose: 2000 });
// //         setSelectedPollOption(null);
// //       })
// //       .catch((err) => {
// //         console.error("Error submitting vote:", err);
// //         setMessage("Failed to submit your vote. Please try again.");
// //       });
// //   };

// //   return (
// //     <div className={styles.pollPage}>
// //       <ToastContainer />
// //       <h1 className={styles.title}>Polls</h1>

// //       <div className={styles.createPoll}>
// //         <h2>Create a New Poll</h2>
// //         <form onSubmit={handlePollSubmit}>
// //           <input
// //             type="text"
// //             placeholder="Enter poll question"
// //             value={newPoll.question}
// //             onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
// //             className={styles.input}
// //           />
// //           {newPoll.options.map((option, index) => (
// //             <input
// //               key={index}
// //               type="text"
// //               placeholder={`Option ${index + 1}`}
// //               value={option}
// //               onChange={(e) =>
// //                 setNewPoll({
// //                   ...newPoll,
// //                   options: newPoll.options.map((opt, i) => (i === index ? e.target.value : opt)),
// //                 })
// //               }
// //               className={styles.input}
// //             />
// //           ))}
// //           <button
// //             type="button"
// //             onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
// //             className={styles.button}
// //           >
// //             Add Option
// //           </button>
// //           <button type="submit" className={styles.button}>
// //             Create Poll
// //           </button>
// //         </form>
// //         {message && <p className={styles.error}>{message}</p>}
// //       </div>

// //       <div className={styles.pollsList}>
// //         <h2>Available Polls</h2>
// //         {polls.length > 0 ? (
// //           polls.map((poll) => (
// //             <div key={poll._id} className={styles.pollCard}>
// //               <p className={styles.pollQuestion}>{poll.question}</p>
// //               <div className={styles.pollOptions}>
// //                 {poll.options.map((optionObj, index) => (
// //                   <label key={index}>
// //                     <input
// //                       type="radio"
// //                       name={`poll-${poll._id}`}
// //                       value={optionObj.option}
// //                       onChange={() => setSelectedPollOption(optionObj.option)}
// //                     />
// //                     {optionObj.option}
// //                   </label>
// //                 ))}
// //               </div>
// //               <button onClick={() => handleVoteSubmit(poll._id)} className={styles.voteButton}>
// //                 Vote
// //               </button>
// //             </div>
// //           ))
// //         ) : (
// //           <p>No polls available at the moment.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default PollPage;