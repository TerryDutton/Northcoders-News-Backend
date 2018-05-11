const mongoose = require('mongoose'); 
const {Users, Articles, Comments, Topics} = require('../models/index.js');
const {crossRefIDsWith, formatArticleData, formatComments, createComments} = require('../utils/utils.js'); 

function seedDB(articleData, commentData, topicData, userData){
  return mongoose.connection.dropDatabase()
  .then(() => Promise.all([Topics.insertMany(topicData), Users.insertMany(userData)]))
  .then(([topicDocs, userDocs]) => {
    const topicRef = crossRefIDsWith(topicDocs, 'slug');
    const userRef = crossRefIDsWith(userDocs, 'username');
    const newArticleData = formatArticleData(articleData, topicRef, userRef);
    return Promise.all([Articles.insertMany(newArticleData), topicDocs, userDocs, userRef]);
  })
  .then(([articleDocs, topicDocs, userDocs, userRef]) => {
    const articleRef = crossRefIDsWith(articleDocs, 'title');
    const newCommentData = formatComments(commentData, articleRef, userRef);
    return Promise.all([articleDocs, Comments.insertMany(newCommentData), topicDocs, userDocs]);
  });
}

module.exports = seedDB;