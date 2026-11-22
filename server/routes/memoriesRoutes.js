const express = require('express')
const router = express.Router()
const {requireUser,requireMember,requireAlumni} = require("../middlewares/identity");
const member = [requireUser, requireMember, requireAlumni];
function ownInbox(req,res,next) {
  if (req.params.email !== req.user.email) return res.sendStatus(403);
  next();
}
const upload = require('../middlewares/multer.js');

const {
  createMemory,
  memory_img,
  getMemories,
  getPendingRequests,
  approveRequest,
  deleteRequest,
} = require('../controllers/memoriesController')

//(filter by locationId / seniorId)
router.get('/memories', getMemories);

//(user must be authenticated before)

router.post(
  '/create-memory',
  ...member,
  upload.array('images', 3),
  createMemory
);

// ADD image to a memory
// router.post('/memories_image', memory_img)

router.get('/memories/get-pending-requests/:email', ...member, ownInbox, getPendingRequests);
router.patch('/memories/accept/:memoryGroupId/:email', ...member, ownInbox, approveRequest);
router.delete('/memories/delete/:memoryGroupId/:email', ...member, ownInbox, deleteRequest);

module.exports = router