const Poll = require('../models/Poll');
const User = require('../models/userModel'); // Import User model if necessary for validation

// Controller to create a new poll
exports.createPoll = async (req, res) => {
  const { question, options, createdBy } = req.body;
  const tokenEmail = req.tokenEmail; 
  if (!question || options.length < 2) {
    return res.status(400).json({ message: "Poll must have a question and at least two options." });
  }
  if (!createdBy) {
    return res.status(400).json({ message: "CreatedBy field is required." });
  }
  if (createdBy !== tokenEmail) {
    return res.status(403).json({ message: "You are not authorized to create this poll." });
  }
  try {
    const user = await User.findOne({ email: createdBy });
    if (!user) {
      return res.status(404).json({ message: "User not found with the provided email." });
    }
    const initializedOptions = options.map(option => ({
        option,
        voteCount: 0,  // Set voteCount to 0 initially
      }));
    const newPoll = new Poll({
      question,
      options:initializedOptions,
      createdBy:user._id, // Use the user name from the request body (ensure it’s passed from frontend)
      votes: [] // Initialize votes as an empty array
    });

    await newPoll.save();
    res.status(201).json({ message: "Poll created successfully!", poll: newPoll });
  } catch (err) {
    res.status(500).json({ message: "Error creating poll", error: err.message });
  }
};

// Controller to handle voting on a poll
exports.votePoll = async (req, res) => {
    const { pollId, option, user } = req.body;
    const email=user
    const tokenEmail = req.tokenEmail;
    if (tokenEmail !== email) {
      return res.status(403).json({ message: "You are not authorized to vote on this poll." });
    }
    if (!pollId || !option) {
      return res.status(400).json({ message: "Poll ID and option are required" });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "User not found with the provided email." });
      }
  
      // Find poll by ID
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
  
      // Check if the user has already voted
      const alreadyVoted = poll.votes.some(vote => vote.votedBy.toString() === user._id.toString());
      if (alreadyVoted) {
        return res.status(400).json({ message: "You have already voted" });
      }
  
      // Find the selected option in the poll
      const pollOption = poll.options.find(opt => opt.option === option);
      if (!pollOption) {
        return res.status(404).json({ message: "Option not found" });
      }
  
      // Increment the vote count for the selected option
      pollOption.voteCount += 1;
  
      // Add the vote to the poll
      poll.votes.push({
        option,
        votedBy: user._id, // Link vote to the user (user._id is the ObjectId)
      });
  
      await poll.save();
      res.status(200).json({ message: "Vote submitted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error submitting vote", error: err.message });
    }
  };
  

// Controller to fetch poll results
exports.getPollById = async (req, res) => {
    const { pollId } = req.query;
    console.log(pollId);
    
  
    if (pollId) {
      // Fetch a specific poll by ID (if pollId is provided in the query)
      try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
          return res.status(404).json({ message: "Poll not found" });
        }
        res.status(200).json({ poll });
      } catch (err) {
        res.status(500).json({ message: "Error fetching poll", error: err.message });
      }
    } else {
      // Fetch all polls if no pollId is provided
      try {
        const polls = await Poll.find(); // Fetch all polls from DB
        res.status(200).json({ polls });
      } catch (err) {
        res.status(500).json({ message: "Error fetching polls", error: err.message });
      }
    }
};


// exports.getAllPolls = async (req, res) => {
//     try {
//       const polls = await Poll.find(); // Fetch all polls
//       res.status(200).json({ polls });
//     } catch (err) {
//       res.status(500).json({ message: "Error fetching polls", error: err.message });
//     }
//   };

  
exports.deletePoll = async (req, res) => {
    const { id } = req.params;
    
    try {
      const poll = await Poll.findById(id);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
  
      // Check if the user is the creator of the poll
    //   if (poll.createdBy !== req.user.email) {
        // return res.status(403).json({ message: 'You are not authorized to delete this poll' });
    //   }
  
      // Delete the poll
      await poll.remove();
      res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting poll', error: err.message });
    }
};




// Get the results of a poll by ID
exports.getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Prepare the data for the pie chart (options and vote counts)
    const results = poll.options.map(option => ({
      option: option.option,
      voteCount: option.voteCount,
    }));

    res.status(200).json({ poll,results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch poll results" });
  }
};


// Fetch poll results by poll ID
// exports.getPollResults = async (req, res) => {
//     // const pollId = await Poll.findById(req.params.id);
//     // console.log("pollId",pollId);
    

//   try {
//     // Find the poll by ID
//     const poll = await Poll.findById(req.params.id);

//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found" });
//     }

//     // Prepare results
//     const results = poll.options.map((option) => ({
//       option: option.text,
//       voteCount: option.votes.length,
//     }));

//     // Send the poll question and results
//     res.status(200).json({
//       poll: {
//         id: poll._id,
//         question: poll.question,
//       },
//       results,
//     });
//   } catch (error) {
//     console.error("Error fetching poll results:", error);
//     res.status(500).json({ error: "Failed to fetch poll results" });
//   }
// };



  

exports.getPoll = async (req, res) => {
    const { id } = req.params; // Get the poll ID from the request params
  
    try {
      // Fetch the poll by its ID from the database
      const poll = await Poll.findById(id);
  
      // If poll is not found, return a 404 response
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
  
      // If poll is found, return the poll data in the response
      return res.status(200).json({ poll });
    } catch (err) {
      console.error("Error fetching poll:", err);
      // If an error occurs while querying, return a 500 error
      return res.status(500).json({ message: "Error fetching poll" });
    }
  };