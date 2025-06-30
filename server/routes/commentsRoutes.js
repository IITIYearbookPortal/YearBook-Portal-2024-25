const express = require('express')
const router = express.Router()
const commentsController = require('../controllers/commentsController')
const { checkToken } = require('../middlewares/authMiddleware')

router.post('/comments', checkToken, commentsController.comments)
router.post('/getComments', checkToken, commentsController.getComments)
router.put('/setApprovedComments', checkToken, commentsController.setApprovedComments)
router.post('/setRejectedComments', checkToken, commentsController.setRejectedComments)
router.post('/getRecieversComments', checkToken, commentsController.getRecieversComments)
router.post('/getRecieversComments2', checkToken, commentsController.getRecieverComments2)
router.post('/removeCommentFromMyComments', checkToken, commentsController.removeCommentFromMyComments)
router.post('/removeCommentFromApprovedComments', checkToken, commentsController.removeCommentFromApprovedComments)
router.post('/updateCommentOrder', checkToken, commentsController.updateCommentOrder)
router.post('/getEditCommentsInfo', checkToken, commentsController.getEditCommentsInfo)
router.post('/editComment', checkToken, commentsController.editComment)
router.post('/ungradmycomment', checkToken, commentsController.ungradmycomment)
router.post('/protectionEditComment', checkToken, commentsController.protectionEditComment)
// router.get('/profile/:roll/:name',commentsController.protectionProfilePage);
// router.get('/protectionProfilePage',commentsController.protectionProfilePage);

module.exports = router