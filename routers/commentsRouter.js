const commentsRouter = require('express').Router(); 
const {alterVoteCountOfComment, deleteComment, getAllComments} = require('../controllers/commentsControllers'); 

commentsRouter.get('/', getAllComments);
commentsRouter.route('/:commentID')
  .put(alterVoteCountOfComment)
  .delete(deleteComment);

module.exports = commentsRouter;