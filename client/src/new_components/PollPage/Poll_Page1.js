import React, { useState } from 'react';
import { Plus, Trash2, Share2 } from 'lucide-react';

const Poll_Page1 = () => {
  // Mock initial polls
  const initialPolls = [
    {
      id: 1,
      question: "What's your favorite programming language?",
      options: ['JavaScript', 'Python', 'Java', 'C++'],
      votes: [45, 30, 15, 10],
      totalVotes: 100
    },
    {
      id: 2,
      question: "Best frontend framework?",
      options: ['React', 'Vue', 'Angular', 'Svelte'],
      votes: [50, 25, 15, 10],
      totalVotes: 100
    }
  ];

  const [polls, setPolls] = useState(initialPolls);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Filter polls based on search term
  const filteredPolls = polls.filter(poll => 
    poll.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOption = () => {
    if (newPoll.options.length >= 6) {
      setError('Maximum 6 options allowed');
      return;
    }
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, '']
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({ ...newPoll, options: newOptions });
  };

  const handleRemoveOption = (index) => {
    if (newPoll.options.length <= 2) {
      setError('Minimum 2 options required');
      return;
    }
    setNewPoll({
      ...newPoll,
      options: newPoll.options.filter((_, i) => i !== index)
    });
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    
    if (!newPoll.question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (newPoll.options.some(opt => !opt.trim())) {
      setError('Please fill all options');
      return;
    }

    const newPollItem = {
      id: polls.length + 1,
      question: newPoll.question,
      options: newPoll.options,
      votes: new Array(newPoll.options.length).fill(0),
      totalVotes: 0
    };

    setPolls([newPollItem, ...polls]);
    setNewPoll({
      question: '',
      options: ['', '']
    });
    setError('');
  };

  const handleVote = (pollId, optionIndex) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex]++;
        return {
          ...poll,
          votes: newVotes,
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    }));
  };

  const handleDeletePoll = (pollId) => {
    setPolls(polls.filter(poll => poll.id !== pollId));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search polls..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Create Poll Form */}
      <div className="bg-white rounded-lg shadow-md border-2 border-blue-100 hover:border-blue-200 transition-colors p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Create New Poll</h2>
        <form onSubmit={handleCreatePoll} className="space-y-4">
          <input
            placeholder="Enter your question"
            value={newPoll.question}
            onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="space-y-2">
            {newPoll.options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newPoll.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Polls List */}
      <div className="space-y-4">
        {filteredPolls.map((poll) => (
          <div 
            key={poll.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6"
          >
            <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>
            
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div key={index} className="relative">
                  <button
                    className="w-full px-4 py-2 text-left rounded-lg hover:bg-blue-50 transition-colors relative z-10 flex justify-between items-center"
                    onClick={() => handleVote(poll.id, index)}
                  >
                    <span>{option}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Share poll: ${poll.question}`);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPolls.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No polls found. Create one to get started!
        </div>
      )}
    </div>
  );
};

export{ Poll_Page1};
