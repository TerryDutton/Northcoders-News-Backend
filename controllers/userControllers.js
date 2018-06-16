const {Topics, Articles, Users, Comments} = require('../models/index.js');
const invalidID = {name: 'ValidationError'};

exports.getUserData = function(req, res, next){
  const {username} = req.params; 

  Users.findOne({username})
  .then(user => user ? res.send({user}) : next({status: 404, message: 'Username not found.'}))
  .catch(next);
}

exports.getAllUsers = function(req, res, next){
  Users.find()
  .then(users => res.send({users}))
  .catch(next); 
}

exports.getCommentsByUserID = function(req, res, next){
  const {userID} = req.params;
  Comments.find({created_by: userID})
  .populate('created_by', 'username')
  .populate('belongs_to', 'title')
  .then(comments => {
    if (comments.length === 0) throw invalidID;
    else return res.send({comments});
  })
  .catch(err => err.name === 'CastError' || err.name === 'ValidationError' ? next({status:400, message: 'Bad request: Invalid user ID.'}) : next(err));
}

exports.getArticlesByUserID = function(req, res, next){
  const {userID} = req.params; 
  Articles.find({created_by: userID})
  .populate('created_by', 'username')
  .populate('belongs_to', 'title')
  .then(articles => {
    if (articles.length === 0) throw invalidID;
    else return res.send({articles});
  })
  .catch(err => {
    if (err.name === 'ValidationError' || err.name === 'CastError') return next({status: 400, message: 'Bad request: Invalid user ID.'});
    else return next(err); 
  }); 
}