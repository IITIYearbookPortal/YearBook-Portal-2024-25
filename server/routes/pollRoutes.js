const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares/authMiddleware');
const {
  createPoll,
  votePoll,
  getPollById,
  deletePoll,
  getPollResults,
  getPoll
  
} = require('../controllers/pollsController');

// Route to fetch all polls
router.get('/polls', checkToken, getPollById);
router.get("/polls/:id", checkToken, getPoll);
// Route to create a new poll
router.post('/createPoll', checkToken, createPoll);


// Route to vote on a poll
router.post('/votePoll', checkToken, votePoll);
router.delete('/polls/:id', checkToken, deletePoll); 

router.get("/polls/results/:id", checkToken, getPollResults);


module.exports = router;
