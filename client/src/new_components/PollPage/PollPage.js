
import { Link } from "react-router-dom"; // Used for navigation
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PollPage.module.css"; // Import CSS Module
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Plus} from 'lucide-react';

const PollPage = () => {
  const [polls, setPolls] = useState([]); // Set to an empty array initially
  const { loggedin, profile,loading } = useContext(LoginContext);
  const [selectedPollOption, setSelectedPollOption] = useState(null);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
  const [message, setMessage] = useState("");
  const [failedPollId, setFailedPollId] = useState(null);
  const navigate = useNavigate();


   useEffect(() => {
      if (!loading && !loggedin) {
        window.location.href = "/login";
      }
    });

  useEffect(() => {
    // Fetch polls from backend
    axios
      .get(process.env.REACT_APP_API_URL + "/polls")
      .then((res) => {
        // Check the response and log it
        console.log(res.data);
        
        // Assuming the data is in res.data.polls, adjust accordingly
        setPolls(res.data.polls || []); // Ensure polls is always an array
       
      })
      .catch((err) => {
        console.error("Error fetching polls:", err);
       
      });
  }, []);

 

  if (loading) {
    return (
      <>
     
     
<div class="loader">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
</div>
      </>
    );
  }

  // Check if polls is an array before calling map()
  if (!Array.isArray(polls)) {
    return <div>Something went wrong. No polls available.</div>;
  }
    const handlePollSubmit = (e) => {
    e.preventDefault();
    if (!newPoll.question || newPoll.options.filter(Boolean).length < 2) {
      // setMessage("Please provide a valid poll question and at least two options.");
      toast.error("Please provide a valid poll question and at least two options.", { autoClose: 2000 });
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
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Create a New Poll</h2>
          <form onSubmit={handlePollSubmit} className="w-full max-w-4xl mx-auto p-4 space-y-6">
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
            <div className="flex gap-5" >
            <button
              type="button"
              onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-black "
            >
              <Plus className="h-5 w-5" /> Add Option
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Poll
            </button>
            </div>
          </form>
        </div>

        <div className="space-y-4 mt-4">

          {polls.map((poll) => (
            <div key={poll._id} className={styles.pollCard}>
              <h2 className={styles.pollQuestion}>{poll.question}</h2>
              <div className={styles.buttonGroup}>
                <Link to={`/polls/results/${poll._id}`}>
                  <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 animate-pulse">Do Polling</button>
                </Link>

                <button class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 hover:opacity-80 hover:scale-95 transform transition-all duration-300 ease-in-out"
                onClick={() => handleDeletePoll(poll._id)}>
  Delete
</button>


                

              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
};



export default PollPage;
