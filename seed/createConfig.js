const fs = require('fs'); 

if (!process.env.CREATE_CONFIG) console.log('Please run this file with the command "npm run createConfig". Unpredictable behaviour may occur if this file is run directly.'); 
else {
fs.mkdir('config', function(err){
  if (err) {
    console.log(err); 
    if (err.code === 'EEXIST') console.log('You already have a config directory. If you wish to create another, rename or delete the current.'); 
    return; 
  }
  else{
    fs.appendFile('./config/index.js', "module.exports = require(`./${process.env.NODE_ENV || 'development'}`);", 'utf8', function(err){
      if (err) throw err;
      else {
        fs.appendFile('./config/test.js', `module.exports = {
articleData: require('../seed/testData/articles.json'),
commentData: require('../seed/testData/comments.json'),
topicData:   require('../seed/testData/topics.json'),
userData:    require('../seed/testData/users.json'), 
DB_URI: 'mongodb://localhost:27017/NCNews_test'
};`, 'utf8', function(err){
          if (err) throw err; 
          else {
            fs.appendFile('./config/development.js', `module.exports = {
articleData: require('../seed/devData/articles.json'),
commentData: require('../seed/devData/comments.json'),
topicData:   require('../seed/devData/topics.json'),
userData:    require('../seed/devData/users.json'),
DB_URI: 'mongodb://localhost:27017/NCNews'
};`, 'utf8', function(err){
              if (err) throw err;
              else {
                fs.appendFile('./config/production.js', `/*
module.exports = {
articleData: require('../seed/devData/articles.json'),
commentData: require('../seed/devData/comments.json),
topicData:   require('../seed/devData/topics.json'),
userData:    require('../seed/devData/users.json'),
DB_URI:    "insert database access data here (keeping the quotation marks)"  
};
*/`, 'utf8', function(err){
                  if (err) throw err; 
                  else console.log('Config files created.');
                });
              }
            });
          }
        });
      }
    });
  }
});
}