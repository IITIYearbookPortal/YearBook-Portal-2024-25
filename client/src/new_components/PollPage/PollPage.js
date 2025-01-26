import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { LoginContext } from "../../helpers/Context";
import { ToastContainer, toast } from "react-toastify";
import { 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';

const PollPage = () => {
  const [polls, setPolls] = useState([]);
  const { loggedin, profile, loading } = useContext(LoginContext);
  const [newPoll, setNewPoll] = useState({ 
    question: "", 
    options: ["", ""] 
  });
  const [activeSection, setActiveSection] = useState(null);

  const adminUsers = process.env.REACT_APP_ADMIN_USERS
    ? process.env.REACT_APP_ADMIN_USERS.split(",")
    : [];
  const isAdmin = profile && adminUsers.includes(profile.email);

  useEffect(() => {
    if (!loading && !loggedin) {
      window.location.href = "/login";
    }
  }, [loading, loggedin]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/polls")
      .then((res) => {
        setPolls(res.data.polls || []);
      })
      .catch(() => {
        toast.error("Network error. Polls unavailable.");
      });
  }, []);

  const handlePollSubmit = (e) => {
    e.preventDefault();
    if (!newPoll.question || newPoll.options.filter(Boolean).length < 2) {
      toast.error("Minimum two options required");
      return;
    }

    axios
      .post(process.env.REACT_APP_API_URL + "/createPoll", {
        question: newPoll.question,
        options: newPoll.options.filter(Boolean),
        createdBy: profile.email,
      })
      .then((res) => {
        setPolls([...polls, res.data.poll]);
        setNewPoll({ question: "", options: ["", ""] });
        setActiveSection(null);
        toast.success("Poll Created!");
      })
      .catch(() => {
        toast.error("Poll Creation Failed");
      });
  };

  const handleDeletePoll = (pollId) => {
    axios
      .delete(process.env.REACT_APP_API_URL + `/polls/${pollId}`)
      .then(() => {
        setPolls(polls.filter((poll) => poll._id !== pollId));
        toast.success("Poll Deleted");
      })
      .catch(() => {
        toast.error("Deletion Failed");
      });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen bg-neutral-900"
      >
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 border-4 border-transparent border-t-cyan-500 rounded-full"
        />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-6 max-w-4xl mx-auto">
      <ToastContainer theme="dark" />

      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
          Community Pulse
        </h1>
        <p className="text-neutral-400 mt-2">Amplify Collective Voices</p>
      </motion.header>

      {isAdmin && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div 
            onClick={() => setActiveSection(activeSection === 'create' ? null : 'create')}
            className="cursor-pointer bg-neutral-800 p-4 rounded-xl flex justify-between items-center hover:bg-neutral-700 transition"
          >
            <span className="font-semibold">Create New Poll</span>
            {activeSection === 'create' ? <ChevronDown /> : <ChevronRight />}
          </div>

          <AnimatePresence>
            {activeSection === 'create' && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handlePollSubmit}
                className="bg-neutral-800 p-6 rounded-b-xl space-y-4"
              >
                <input
                  type="text"
                  placeholder="Poll Question"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  className="w-full bg-neutral-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                
                {newPoll.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll({ ...newPoll, options: newOptions });
                    }}
                    className="w-full bg-neutral-700 text-white p-3 rounded-lg"
                  />
                ))}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                  >
                    <PlusCircle /> Add Option
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
                  >
                    <CheckCircle2 /> Create
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="space-y-4">
        {polls.map((poll) => (
          <motion.div
            key={poll._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-800 rounded-xl p-5 flex justify-between items-center group"
          >
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 group-hover:text-cyan-400 transition">
                {poll.question}
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <Link to={`/polls/results/${poll._id}`}>
                <button className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg hover:bg-cyan-500/40 transition">
                  Vote
                </button>
              </Link>
              {isAdmin && (
                <button 
                  onClick={() => handleDeletePoll(poll._id)}
                  className="text-red-500 hover:text-red-400 transition"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PollPage;