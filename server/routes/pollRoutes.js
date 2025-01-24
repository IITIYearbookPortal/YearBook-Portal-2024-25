const express = require('express');
const router = express.Router();
const {
  createPoll,
  votePoll,
  getPollById,
  deletePoll,
  getPollResults,
  getPoll
  
} = require('../controllers/pollsController');

// Route to fetch all polls
router.get('/polls', getPollById);
router.get("/polls/:id", getPoll);
// Route to create a new poll
router.post('/createPoll', createPoll);


// Route to vote on a poll
router.post('/votePoll', votePoll);
router.delete('/polls/:id', deletePoll); 

router.get("/polls/results/:id", getPollResults);


module.exports = router;
