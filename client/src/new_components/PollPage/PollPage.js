import { Link } from "react-router-dom"; // Used for navigation
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PollPage.module.css"; // Import CSS Module
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Plus } from "lucide-react";
import alumniEmails from "../../new_components/Navbar/akumniData.json";
import { forbiddenError, unauthorizedError } from "../../utils/authErrors";

const PollPage = () => {
  const [polls, setPolls] = useState([]); // Set to an empty array initially
  const { loggedin, profile, loading, user, setUser, setLoggedin } =
    useContext(LoginContext);
  const [selectedPollOption, setSelectedPollOption] = useState(null);
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: [
      { rollNo: "", name: "" },
      { rollNo: "", name: "" },
    ],
  });
  const [message, setMessage] = useState("");
  const [failedPollId, setFailedPollId] = useState(null);
  const navigate = useNavigate();

  // Check if the current user is an alumni
  const isAlumni = profile && alumniEmails.includes(profile.email);

  const adminUsers = process.env.REACT_APP_ADMIN_USERS
    ? process.env.REACT_APP_ADMIN_USERS.split(",")
    : [];
  const isAdmin = profile && adminUsers.includes(profile.email);
  // const isAdmin =true;

  useEffect(() => {
    if (!loading && !loggedin) {
      window.location.href = "/login";
    }
  });
  useEffect(() => {
    // Redirect non-alumni users to home
    if (!loading && profile && !isAlumni) {
      navigate("/");
    }
  }, [loading, profile, isAlumni, navigate]);

  useEffect(() => {
    // Fetch polls from backend
    axios
      .get(
        process.env.REACT_APP_API_URL + "/polls",
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
          },
        }
      )
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

    // Validate inputs
    if (
      !newPoll.question ||
      newPoll.options.filter((opt) => opt.rollNo && opt.name).length < 2
    ) {
      toast.error(
        "Please provide a valid poll question and at least two options with both roll number and name.",
        { autoClose: 2000 }
      );
      return;
    }

    // Combine roll numbers and names into single strings
    const processedOptions = newPoll.options
      .filter((opt) => opt.rollNo && opt.name)
      .map((opt) => `${opt.rollNo} - ${opt.name}`);

    axios
      .post(
        process.env.REACT_APP_API_URL + "/createPoll",
        {
          question: newPoll.question,
          options: processedOptions,
          createdBy: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 401) {
          forbiddenError(setLoggedin, setUser, res.data.message);
        }
        if (res.status === 403) {
          unauthorizedError(setLoggedin, setUser, res.data.message);
        }
        toast.success("Poll created successfully!", { autoClose: 2000 });
        setPolls([...polls, res.data.poll]);
        setNewPoll({
          question: "",
          options: [
            { rollNo: "", name: "" },
            { rollNo: "", name: "" },
          ],
        });
      })
      .catch((err) => {
        console.error("Error creating poll:", err);
        toast.error("Failed to create poll. Please try again.");
      });
  };

  const handleDeletePoll = (pollId) => {
    console.log("deleting poll with id", pollId);

    axios
      .delete(
        process.env.REACT_APP_API_URL + `/polls/${pollId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("yearbook-token")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 401) {
          forbiddenError(setLoggedin, setUser, res.data.message);
        }
        if (res.status === 403) {
          unauthorizedError(setLoggedin, setUser, res.data.message);
        }
        toast.success("Poll deleted successfully!", { autoClose: 2000 });
        setPolls(polls.filter((poll) => poll._id !== pollId)); // Remove the deleted poll from the state
      })
      .catch((err) => {
        console.error("Error deleting poll:", err);
        toast.error("Failed to delete poll. Please try again.");
      });
  };

  return (
    <div className="bg-gray-800">
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.description}>
          <div className="text-[2.5rem] font-bold text-center text-green-400 mb-4">
            Welcome to the Polling Portal!
          </div>
          <div
            className="text-gray-300 text-center max-w-2xl mx-auto mb-6"
            style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
          >
            Participate in engaging polls created by the community! Your opinion
            matters. Browse through the polls below and cast your vote.
          </div>
        </div>

        {isAdmin && (
          <div className={styles.createPoll}>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Create a New Poll
            </h2>
            <form
              onSubmit={handlePollSubmit}
              className="w-full max-w-4xl mx-auto p-4 space-y-6"
            >
              <input
                type="text"
                placeholder="Enter poll question"
                value={newPoll.question}
                onChange={(e) =>
                  setNewPoll({ ...newPoll, question: e.target.value })
                }
                className={styles.input}
              />
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Roll No"
                      value={option.rollNo}
                      onChange={(e) =>
                        setNewPoll({
                          ...newPoll,
                          options: newPoll.options.map((opt, i) =>
                            i === index
                              ? { ...opt, rollNo: e.target.value }
                              : opt
                          ),
                        })
                      }
                      className={`${styles.input} w-1/2`}
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={option.name}
                      onChange={(e) =>
                        setNewPoll({
                          ...newPoll,
                          options: newPoll.options.map((opt, i) =>
                            i === index ? { ...opt, name: e.target.value } : opt
                          ),
                        })
                      }
                      className={`${styles.input} w-1/2`}
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() =>
                    setNewPoll({
                      ...newPoll,
                      options: [...newPoll.options, { rollNo: "", name: "" }],
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-black "
                >
                  <Plus className="h-5 w-5" /> Add Option
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="space-y-4 mt-4">
          {polls.map((poll) => (
            <div
              key={poll._id}
              className="bg-gray-900 p-5 mb-[15px] rounded-lg shadow-md flex flex-col items-start"
            >
              <h2 className={styles.pollQuestion}>{poll.question}</h2>
              <div className={styles.buttonGroup}>
                <Link to={`/polls/results/${poll._id}`}>
                  <button className="px-4 py-2 bg-green-500 text-[#EEEEEE] font-semibold rounded-lg shadow-md hover:bg-green-600 animate-pulse">
                    Do Polling
                  </button>
                </Link>
                {isAdmin && (
                  <button
                    class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 hover:opacity-80 hover:scale-95 transform transition-all duration-300 ease-in-out"
                    onClick={() => handleDeletePoll(poll._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollPage;
