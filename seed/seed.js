const mongoose = require('mongoose'); 
const {Users, Articles, Comments, Topics} = require('../models/index.js');
const {getCrossRefOfIDs, buildArticleData, formatPresetComments, createNewComments} = require('../utils/utils.js'); 

function seedDB(data){
  const {userData, articleData, commentData, topicData} = data;
  return mongoose.connection.dropDatabase()
  .then(() => Promise.all([Topics.insertMany(topicData), Users.insertMany(userData)]))
  .then(([topicDocs, userDocs]) => {
    const topicRef = getCrossRefOfIDs(topicDocs, 'slug'); 
    const newArticleData = buildArticleData(articleData, topicRef, userDocs);
    return Promise.all([Articles.insertMany(newArticleData), topicDocs, userDocs]);
  })
  .then(([articleDocs, topicDocs, userDocs]) => {
    let newCommentData; 
    if (commentData) {
      const articleRef = getCrossRefOfIDs(articleDocs, 'title');
      const userRef = getCrossRefOfIDs(userDocs, 'username');
      newCommentData = formatPresetComments(commentData, articleRef, userRef);
    }
    else newCommentData = createNewComments(articleDocs.length * 2, userDocs, articleDocs); 
    return Promise.all([Comments.insertMany(newCommentData), articleDocs, topicDocs, userDocs]);
  });
}

module.exports = seedDB;