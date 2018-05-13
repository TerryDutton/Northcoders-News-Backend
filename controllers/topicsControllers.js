const {Topics, Articles, Users, Comments} = require('../models/index.js');
const invalidID = {name: 'ValidationError'};

exports.getAllTopics = function(req, res, next){
  Topics.find()
  .then(topics => res.send({topics}))
  .catch(next); 
}

exports.getArticlesByTopicID = function(req, res, next){
  const {topicID} = req.params; 
  Articles.find({belongs_to: topicID})
  .populate('created_by', 'username')
  .populate('belongs_to', 'title')
  .then(articles => {
    if (articles.length === 0) throw invalidID;
    else return res.send({articles});
  })
  .catch(err => {
    if (err.name === 'ValidationError' || err.name === 'CastError') return next({status: 400, message: 'Bad request: Invalid topic ID.'});
    else return next(err); 
  }); 
}

exports.addArticleByTopicID = function(req, res, next){
  const article = req.body;  
  const {topicID} = req.params;
  const formattedArticle = {
    ...article, 
    belongs_to: topicID,
    votes: 0
  };

  return Users.findById(article.created_by)
  .then(user => {
    if (!user) throw invalidID;
    else return Topics.findById(topicID);
  })
  .then(topic => {
    if (!topic) throw invalidID;
    else return new Articles(formattedArticle).save();
  })
  .then(article => res.status(201).send({article}))
  .catch(err => {
    if (err.name === 'ValidationError' || err.name === 'CastError') return next({status:400, message: 'Bad request: Invalid topic ID, or article data mising/invalid.'});
    else return next(err);
  });
}