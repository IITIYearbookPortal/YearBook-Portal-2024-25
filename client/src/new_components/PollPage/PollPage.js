import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./PollPage.module.css";
import { Plus } from "lucide-react";
import alumniEmails from "../../new_components/Navbar/akumniData.json";

const PollPage = () => {
  const [polls, setPolls] = useState([]);
  const { loggedin, profile, loading } = useContext(LoginContext);
  const [newPoll, setNewPoll] = useState({
    question: "",
    academic_program: "Bachelor of Technology (BTech)",
    options: [{ rollNo: "", name: "" }, { rollNo: "", name: "" }]
  });
  const navigate = useNavigate();

  // Admin check
 const adminUsers = process.env.REACT_APP_ADMIN_USERS
  ? process.env.REACT_APP_ADMIN_USERS.split(",")
  : [];

const isAlumni = Array.isArray(alumniEmails) && profile?.email
  ? alumniEmails.includes(profile.email)
  : false;

const isAdmin = Array.isArray(adminUsers) && profile?.email
  ? adminUsers.includes(profile.email)
  : false;

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !loggedin) window.location.href = "/login";
  }, [loading, loggedin]);

  // Fetch all polls
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/polls`)
      .then(res => setPolls(res.data.polls || []))
      .catch(err => console.error("Error fetching polls:", err));
  }, []);

  // Handle new poll submission
  const handlePollSubmit = (e) => {
    e.preventDefault();

    if (!newPoll.question || newPoll.options.filter(opt => opt.rollNo && opt.name).length < 2) {
      toast.error("Provide question & at least 2 options.", { autoClose: 2000 });
      return;
    }

    const processedOptions = newPoll.options
      .filter(opt => opt.rollNo && opt.name)
      .map(opt => `${opt.rollNo} - ${opt.name}`);

    axios
      .post(`${process.env.REACT_APP_API_URL}/createPoll`, {
        question: newPoll.question,
        academic_program: newPoll.academic_program,
        options: processedOptions,
        createdBy: profile.email
      })
      .then(res => {
        toast.success("Poll created successfully!", { autoClose: 2000 });
        setPolls([...polls, res.data.poll]);
        setNewPoll({
          question: "",
          academic_program: "Bachelor of Technology (BTech)",
          options: [{ rollNo: "", name: "" }, { rollNo: "", name: "" }]
        });
      })
      .catch(err => {
        console.error("Error creating poll:", err);
        toast.error("Failed to create poll. Try again.");
      });
  };

  // Delete poll
  const handleDeletePoll = (pollId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/polls/${pollId}`)
      .then(() => {
        toast.success("Poll deleted successfully!", { autoClose: 2000 });
        setPolls(polls.filter(p => p._id !== pollId));
      })
      .catch(err => {
        console.error("Error deleting poll:", err);
        toast.error("Failed to delete poll. Try again.");
      });
  };

  // Split polls for display
  const ugPolls = polls.filter(p => p.academic_program.includes("BTech"));
  const pgPolls = polls.filter(p => p.academic_program.includes("MTech"));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="loader">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 min-h-screen px-4 py-8">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 text-center mb-8">
          Welcome to the Polling Portal
        </h1>

        {/* Admin Create Poll */}
        {isAdmin && (
          <div className="bg-gray-900 p-6 rounded-lg mb-8 shadow-md">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Create a New Poll</h2>
            <form onSubmit={handlePollSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter poll question"
                value={newPoll.question}
                onChange={e => setNewPoll({ ...newPoll, question: e.target.value })}
                className={styles.input}
              />

              <select
                value={newPoll.academic_program}
                onChange={e => setNewPoll({ ...newPoll, academic_program: e.target.value })}
                className={styles.input}
              >
                <option value="Bachelor of Technology (BTech)">UG (BTech)</option>
                <option value="Master of Technology (MTech)">PG (MTech)</option>
              </select>

              {newPoll.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Roll No"
                    value={option.rollNo}
                    onChange={e =>
                      setNewPoll({
                        ...newPoll,
                        options: newPoll.options.map((opt, i) =>
                          i === index ? { ...opt, rollNo: e.target.value } : opt
                        )
                      })
                    }
                    className={`${styles.input} w-1/2`}
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    value={option.name}
                    onChange={e =>
                      setNewPoll({
                        ...newPoll,
                        options: newPoll.options.map((opt, i) =>
                          i === index ? { ...opt, name: e.target.value } : opt
                        )
                      })
                    }
                    className={`${styles.input} w-1/2`}
                  />
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setNewPoll({
                    ...newPoll,
                    options: [...newPoll.options, { rollNo: "", name: "" }]
                  })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-black"
                >
                  <Plus className="h-5 w-5" /> Add Option
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Two-Column Poll Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UG Column */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">UG Polls</h2>
            <div className="space-y-4">
              {ugPolls.length > 0 ? (
                ugPolls.map(poll => (
                  <div key={poll._id} className="bg-gray-900 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-[#EEEEEE] mb-2">{poll.question}</h3>
                    <div className="flex gap-2 mt-2">
                      <Link to={`/polls/results/${poll._id}`}>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                          Do Polling
                        </button>
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeletePoll(poll._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No UG polls available.</p>
              )}
            </div>
          </div>

          {/* PG Column */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-4">PG Polls</h2>
            <div className="space-y-4">
              {pgPolls.length > 0 ? (
                pgPolls.map(poll => (
                  <div key={poll._id} className="bg-gray-900 p-5 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-[#EEEEEE] mb-2">{poll.question}</h3>
                    <div className="flex gap-2 mt-2">
                      <Link to={`/polls/results/${poll._id}`}>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                          Do Polling
                        </button>
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeletePoll(poll._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No PG polls available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollPage;