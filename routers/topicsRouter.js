const topicsRouter = require('express').Router(); 
const {getAllTopics, getArticlesByTopicID, addArticleByTopicID} = require('../controllers/topicsControllers.js');

topicsRouter.get('/', getAllTopics);
topicsRouter.route('/:topicID/articles')
  .get(getArticlesByTopicID)
  .post(addArticleByTopicID);
module.exports = topicsRouter; 