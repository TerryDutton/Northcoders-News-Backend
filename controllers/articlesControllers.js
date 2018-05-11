const {Topics, Articles, Users, Comments} = require('../models/index.js');
const invalidID = {name: 'ValidationError'};

exports.getAllArticles = function(req, res, next){
  Articles.find()
  .populate('created_by', 'username')
  .then(articles => res.send({articles}))
  .catch(next); 
}

exports.getArticleByID = function(req, res, next){
  const {articleID} = req.params; 
  Articles.findById(articleID)
  .then(article => {
    if (!article) throw invalidID;
    else return res.send({article});
  })
  .catch(err => err.name === 'CastError' || err.name === 'ValidationError' ? next({status:404, message: 'Page not found (Invalid article ID).'}) : next(err));
}

exports.getCommentsByArticleID = function(req, res, next){
  const {articleID} = req.params;
  Comments.find({belongs_to: articleID})
  .then(comments => {
    if (comments.length === 0) throw invalidID;
    else return res.send({comments});
  })
  .catch(err => err.name === 'CastError' || err.name === 'ValidationError' ? next({status:400, message: 'Bad request: Invalid article ID.'}) : next(err));
}

exports.addCommentToArticle = function(req, res, next){
  const {articleID} = req.params; 
  const comment = req.body;
  const newComment = {
    ...comment, 
    belongs_to: articleID
  };
  return Articles.findById(articleID)
  .then(article => {
    if (!article) throw invalidID; 
    else return Users.findById(comment.created_by);
  })
  .then(user => {
    if (!user) throw invalidID; 
    else return new Comments(newComment).save();
  })
  .then(comment => res.status(201).send({comment}))
  .catch(err => err.name === 'CastError' || err.name === 'ValidationError' ? next({status: 400, message: 'Bad request: invalid article ID, or invalid comment data.'}) : next(err));
}

exports.alterVoteCountOfArticle = function(req, res, next){
  const vote = req.query.vote.toLowerCase(); 

  if(vote !== 'up' && vote !== 'down') return next({status: 400, message: 'Bad request: vote query should be either "up" or "down".'});

  const {articleID} = req.params; 
  const adjustment = vote === 'up' ? 1 : -1; 
  Articles.findByIdAndUpdate(articleID, {$inc: {votes: adjustment}}, {new: true})
  .then(article => {
    if (!article) throw invalidID;
    res.send({article});
  })
  .catch(err => err.name === 'CastError' || err.name === 'ValidationError' ? next({status: 400, message: 'Bad request: invalid article ID.'}) : next(err));
}