const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    option: String,
    voteCount: {
      type: Number,
      default: 0,  // Initialize vote count as 0 for each option
    },
  }],
  votes: [{
    option: String,
    votedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users', // Reference to the User model
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the User model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Poll', pollSchema);
