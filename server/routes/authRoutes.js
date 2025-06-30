const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const  { checkToken } = require('../middlewares/authMiddleware')

router
  .route('/auth')
  .get(checkToken, authController.getAllusers)
  .post(authController.createUsers)

router.post('/checkAuth', checkToken, authController.checkAuth)

module.exports = router
