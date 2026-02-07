const express = require('express')
const router = express.Router()
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
  upload.array('images', 3),
  createMemory
);

// ADD image to a memory
// router.post('/memories_image', memory_img)

router.get('/memories/get-pending-request',getPendingRequests);
router.patch('/memories/accept/:memoryId',approveRequest);
router.delete('/memories/delete/:memoryId',deleteRequest);

module.exports = router