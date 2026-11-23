const express = require('express')
const {ownRoll} = require("../middlewares/identity");
const { byAccount } = require("../middlewares/rateLimit");
const router = express.Router()
const commentsController = require('../controllers/commentsController')

router.post('/comments', byAccount(25), commentsController.comments)
router.post('/getComments', ownRoll,  commentsController.getComments)
router.put('/setApprovedComments', ownRoll,  commentsController.setApprovedComments)
router.post('/setRejectedComments', ownRoll,  commentsController.setRejectedComments)
router.post('/getRecieversComments', ownRoll,  commentsController.getRecieversComments)
router.post('/getRecieversComments2', commentsController.getRecieverComments2)
router.post('/removeCommentFromMyComments', commentsController.removeCommentFromMyComments)
router.post('/removeCommentFromApprovedComments', ownRoll,  commentsController.removeCommentFromApprovedComments)
router.post('/updateCommentOrder', ownRoll, byAccount(12), commentsController.updateCommentOrder)
router.post('/getEditCommentsInfo',commentsController.getEditCommentsInfo)
router.post('/editComment',commentsController.editComment)
router.post('/ungradmycomment',commentsController.ungradmycomment)
router.post('/protectionEditComment',commentsController.protectionEditComment)
// router.get('/profile/:roll/:name',commentsController.protectionProfilePage);
// router.get('/protectionProfilePage',commentsController.protectionProfilePage);

module.exports = router
