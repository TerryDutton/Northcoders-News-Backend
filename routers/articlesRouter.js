const articlesRouter = require('express').Router(); 
const {getAllArticles, getArticleByID, getCommentsByArticleID, addCommentToArticle, alterVoteCountOfArticle} = require('../controllers/articlesControllers.js');

articlesRouter.get('/', getAllArticles);
articlesRouter.route('/:articleID/comments')
  .get(getCommentsByArticleID)
  .post(addCommentToArticle);
articlesRouter.route('/:articleID')
  .get(getArticleByID)
  .put(alterVoteCountOfArticle);

module.exports = articlesRouter; 