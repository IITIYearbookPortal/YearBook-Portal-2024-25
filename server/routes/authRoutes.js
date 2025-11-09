const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router
  .route('/auth')
  .get(authController.getAllusers)
  .post(authController.createUsers)

router.post('/checkAuth', authController.checkAuth)

module.exports = router
