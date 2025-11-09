const express = require('express')
const router = express.Router()
const memoriesController = require('../controllers/memoriesController')

router.post('/memories_image', memoriesController.memory_img)

module.exports = router;