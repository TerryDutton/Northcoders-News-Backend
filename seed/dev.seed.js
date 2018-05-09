const mongoose = require('mongoose'); 
const seedDB = require('./seed.js'); 
const data = require('../config/index.js'); 
const dbAppend = process.env.NODE_ENV === 'test' ? '_test' : '';


mongoose.connect(`mongodb://localhost:27017/NCNews${dbAppend}`)
.then(() => seedDB(data))
.then(([commentDocs, articleDocs, topicDocs, userDocs]) => {
  console.log(`Created ${topicDocs.length} topics, ${userDocs.length} users, ${articleDocs.length} articles and ${commentDocs.length} comments.`);
  return mongoose.disconnect();
})
.catch(err => {
  console.log(err);
  return mongoose.disconnect();
});