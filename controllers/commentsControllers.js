const {Topics, Articles, Users, Comments} = require('../models/index.js');
const invalidID = {name: 'ValidationError'};

exports.alterVoteCountOfComment = function(req, res, next){
  const vote = req.query.vote.toLowerCase(); 

  if(vote !== 'up' && vote !== 'down') return next({status: 400, message: 'Bad request: vote query should be either "up" or "down".'});

  const {commentID} = req.params; 
  const adjustment = vote === 'up' ? 1 : -1; 
  Comments.findByIdAndUpdate(commentID, {$inc: {votes: adjustment}}, {new: true})
  .populate('created_by', 'username')
  .populate('belongs_to', 'title')
  .then(comment => {
    if (!comment) throw invalidID;
    else return res.send({comment});
  })
  .catch(err => {
    if (err.name === 'CastError' || err.name === 'ValidationError') return next({status: 400, message: 'Bad request: invalid comment ID.'});
    else return next(err);
  }); 
}

exports.deleteComment = function(req, res, next){
  const {commentID} = req.params; 

  Comments.findByIdAndRemove(commentID)
  .populate('created_by', 'username')
  .populate('belongs_to', 'title')
  .then(comment => {
    if (!comment) throw invalidID;
    else return res.send({comment, message: `Comment ${comment._id} successfully deleted.`});
  })
  .catch(err => {
    if (err.name === 'CastError' || err.name === 'ValidationError') return next({status: 400, message: 'Bad request: invalid comment ID.'});
    else return next(err);
  }); 
}