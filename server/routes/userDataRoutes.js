const express = require('express')
const router = express.Router()
const userDataController = require('../controllers/userDataController')

router
  .route('/userData')
  .get(userDataController.getUsersData)
  .post(userDataController.createUsersData)

router.get('/verify/:id', userDataController.verify)
router.post('/profile', userDataController.getProfileData)
router.post('/wordEntered', userDataController.getWordEntered)
router.post('/searchword', userDataController.getSearchWord)
router.post('/findAUser', userDataController.findAUser)
router.post('/verify', userDataController.verifyPhoneOtp)
router.post('/resendMail', userDataController.resendMail)
router.put('/updateUser', userDataController.updateUser)
router.get('/getUsersData', userDataController.getUsersData)
router.post('/getUsersDatanew', userDataController.getUsersDatanew)
router.post('/userDataNew', userDataController.userDataNew)
router.post('/userDataemail', userDataController.userDataNewemail)

module.exports = router
