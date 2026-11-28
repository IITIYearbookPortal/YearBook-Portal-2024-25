const express = require('express');
const { requireAlumni } = require('../middlewares/identity');
function admin(req,res,next) {
  if (!req.user.pollAdmin) return res.sendStatus(403);
  next();
}
const router = express.Router();
router.use(requireAlumni);
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
router.post('/createPoll', admin, createPoll);


// Route to vote on a poll
router.post('/votePoll', votePoll);
router.delete('/polls/:id', admin, deletePoll);

router.get("/polls/results/:id", getPollResults);


module.exports = router;
