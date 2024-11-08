const express = require('express')
const router = express.Router()
const commentsController = require('../controllers/commentsController')

router.post('/comments', commentsController.comments)
router.post('/getComments', commentsController.getComments)
router.put('/setApprovedComments', commentsController.setApprovedComments)
router.post('/setRejectedComments', commentsController.setRejectedComments)
router.post('/getRecieversComments', commentsController.getRecieversComments)
router.post('/getRecieversComments2', commentsController.getRecieverComments2)
router.post('/removeCommentFromMyComments', commentsController.removeCommentFromMyComments)
router.post('/removeCommentFromApprovedComments', commentsController.removeCommentFromApprovedComments)
router.post('/updateCommentOrder',commentsController.updateCommentOrder)
router.post('/getEditCommentsInfo',commentsController.getEditCommentsInfo)
router.post('/editComment',commentsController.editComment)
router.post('/ungradmycomment',commentsController.ungradmycomment)
router.post('/protectionEditComment',commentsController.protectionEditComment)
// router.get('/profile/:roll/:name',commentsController.protectionProfilePage);
// router.get('/protectionProfilePage',commentsController.protectionProfilePage);

module.exports = router