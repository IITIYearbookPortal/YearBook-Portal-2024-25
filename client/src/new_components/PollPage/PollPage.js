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

import { Link } from "react-router-dom"; // Used for navigation
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PollPage.module.css"; // Import CSS Module

const PollPage = () => {
  const [polls, setPolls] = useState([]); // Set to an empty array initially
  const [loading, setLoading] = useState(true);
  const { loggedin, profile } = useContext(LoginContext);
  const [selectedPollOption, setSelectedPollOption] = useState(null);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
  const [message, setMessage] = useState("");
  const [failedPollId, setFailedPollId] = useState(null);
  const navigate = useNavigate();
  console.log("loggedin",loggedin);
  

  useEffect(() => {
    // Simulate fetching logged-in state
    setTimeout(() => {
      setLoading(false); // Set this to false after checking
    }, 1000);
  }, []); 

   useEffect(() => {
  if (!loading && !loggedin) {
    navigate("/login");
  }
}, [loggedin]);

  useEffect(() => {
    // Fetch polls from backend
    axios
      .get(process.env.REACT_APP_API_URL + "/polls")
      .then((res) => {
        // Check the response and log it
        console.log(res.data);
        
        // Assuming the data is in res.data.polls, adjust accordingly
        setPolls(res.data.polls || []); // Ensure polls is always an array
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching polls:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading polls...</div>;
  }

  // Check if polls is an array before calling map()
  if (!Array.isArray(polls)) {
    return <div>Something went wrong. No polls available.</div>;
  }
    const handlePollSubmit = (e) => {
    e.preventDefault();
    if (!newPoll.question || newPoll.options.filter(Boolean).length < 2) {
      // setMessage("Please provide a valid poll question and at least two options.");
      toast.success("Please provide a valid poll question and at least two options.", { autoClose: 2000 });
      return;
    }
    
    axios
      .post(process.env.REACT_APP_API_URL + "/createPoll", {
        question: newPoll.question,
        options: newPoll.options.filter(Boolean),
        createdBy: profile.email,
      })
      .then((res) => {
        toast.success("Poll created successfully!", { autoClose: 2000 });
        setPolls([...polls, res.data.poll]);
        setNewPoll({ question: "", options: ["", ""] });
        setMessage("");
      })
      .catch((err) => {
        console.error("Error creating poll:", err);
        setMessage("Failed to create poll. Please try again.");
      });
  };

    const handleDeletePoll = (pollId) => {
    console.log("deleting poll with id", pollId);
    
    axios
      .delete(process.env.REACT_APP_API_URL + `/polls/${pollId}`)
      .then(() => {
        toast.success("Poll deleted successfully!", { autoClose: 2000 });
        setPolls(polls.filter((poll) => poll._id !== pollId)); // Remove the deleted poll from the state
      })
      .catch((err) => {
        console.error("Error deleting poll:", err);
        toast.error("Failed to delete poll. Please try again.");
      });
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.createPoll}>
          <h2>Create a New Poll</h2>
          <form onSubmit={handlePollSubmit}>
            <input
              type="text"
              placeholder="Enter poll question"
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              className={styles.input}
            />
            {newPoll.options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) =>
                  setNewPoll({
                    ...newPoll,
                    options: newPoll.options.map((opt, i) => (i === index ? e.target.value : opt)),
                  })
                }
                className={styles.input}
              />
            ))}
            <button
              type="button"
              onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
              className={styles.button}
            >
              Add Option
            </button>
            <button type="submit" className={styles.button}>
              Create Poll
            </button>
          </form>
        </div>

        <div className={styles.pollsContainer}>
          <h1 className={styles.fontsize}>Polls</h1>
          {polls.map((poll) => (
            <div key={poll._id} className={styles.pollCard}>
              <h2 className={styles.pollQuestion}>{poll.question}</h2>
              <div className={styles.buttonGroup}>
                <Link to={`/polls/results/${poll._id}`}>
                  <button className={styles.primaryButton}>Do Polling</button>
                </Link>
                <button
                  onClick={() => handleDeletePoll(poll._id)}
                  className={styles.dangerButton}
                >
                  Delete Poll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const pollStyles = {
  margin: "20px",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const buttonStyles = {
  padding: "10px 20px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default PollPage;
