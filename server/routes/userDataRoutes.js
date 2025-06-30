const express = require('express')
const router = express.Router()
const userDataController = require('../controllers/userDataController')
const { checkToken } = require('../middlewares/authMiddleware')

router
  .route('/userData')
  .get(checkToken, userDataController.getUsersData)
  .post(checkToken, userDataController.createUsersData)

router.get('/verify/:id', userDataController.verify)
router.post('/profile', checkToken, userDataController.getProfileData)
router.post('/wordEntered', checkToken, userDataController.getWordEntered)
router.post('/searchword', checkToken, userDataController.getSearchWord)
router.post('/findAUser', checkToken, userDataController.findAUser)
router.post('/verify', checkToken, userDataController.verifyPhoneOtp)
router.post('/resendMail', checkToken, userDataController.resendMail)
router.put('/updateUser', checkToken, userDataController.updateUser)
router.get('/getUsersData', checkToken, userDataController.getUsersData)
router.post('/getUsersDatanew', checkToken, userDataController.getUsersDatanew)
router.post('/userDataNew', userDataController.userDataNew)
router.post('/userDataemail', checkToken, userDataController.userDataNewemail)

module.exports = router
