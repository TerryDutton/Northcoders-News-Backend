const commentsRouter = require('express').Router(); 
const {alterVoteCountOfComment, deleteComment} = require('../controllers/commentsControllers'); 

commentsRouter.route('/:commentID')
  .put(alterVoteCountOfComment)
  .delete(deleteComment);

module.exports = commentsRouter;