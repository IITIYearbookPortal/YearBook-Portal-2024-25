const express = require('express')
const router = express.Router()
const memoriesController = require('../controllers/memoriesController')
const { checkToken } = require('../middlewares/authMiddleware')

router.post('/memories_image', checkToken, memoriesController.memory_img)

module.exports = router;