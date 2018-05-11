const mongoose = require('mongoose'); 
const seedDB = require('./seed.js'); 
let   {articleData, commentData, topicData, userData} = require('../config/index.js'); 
const {DB_URI} = require('../config/index.js');
const {modifyArticleData, createComments} = require('../utils/utils.js');

articleData = modifyArticleData(articleData, userData); 

console.log(articleData[0]);
if (!commentData) commentData = createComments(articleData.length * 3, userData, articleData);
console.log(DB_URI);
mongoose.connect(DB_URI)
.then(() => seedDB(articleData, commentData, topicData, userData))
.then(([articleDocs, commentDocs, topicDocs, userDocs]) => {
  console.log(`Created ${topicDocs.length} topics, ${userDocs.length} users, ${articleDocs.length} articles and ${commentDocs.length} comments.`);
  return mongoose.disconnect();
})
.catch(err => {
  console.log(err);
  return mongoose.disconnect();
});