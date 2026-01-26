const express = require('express')
const router = express.Router()

const {
  createMemory,
  memory_img,
  getMemoriesBySenior,
  getPendingRequests,
} = require('../controllers/memoriesController')
//(filter by locationId / seniorId)
router.get('/memories/get-pending-request',getPendingRequests);
router.get('/memories/senior/:seniorId', getMemoriesBySenior)

//(user must be authenticated before)
router.post('/create-memory', createMemory)

// ADD image to a memory
router.post('/memories_image', memory_img)

module.exports = router
