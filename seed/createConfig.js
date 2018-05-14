const fs = require('fs'); 

if (!process.env.CREATE_CONFIG) console.log('To run this file use "npm run createConfig". Undesirable behaviour can occur if this file is run directly.');
else return makeDir()
.then(() => makeFile('index', "module.exports = require(`./${process.env.NODE_ENV || 'development'}`);"))
.then(() => makeFile('test', makeFileContents('test')))
.then(() => makeFile('development', makeFileContents('dev')))
.then(() => makeFile('production', makeFileContents('production')))
.then(() => console.log('Config files created.'))
.catch(err => {
  console.log(err.errObj); 
  return console.log(err.message);
});

function makeDir(){
  return new Promise(function(resolve, reject){
    return fs.mkdir('config', function(err){
      if (err) return reject({errObj: err, message: 'You already have a config directory. To create another, rename or delete the current.'});
      else return resolve();
    });
  });
}

function makeFile(fileName, fileContents){
  return new Promise(function(resolve, reject){
    fs.appendFile(`./config/${fileName}.js`, fileContents, 'utf8', function(err){
      if (err) return reject({errObj, message: `Failed to create ${fileName}.js. Process terminated.`});
      else return resolve();
    });
  });
}

function makeFileContents(file){
const dirName = file === 'test' ? 'testData' : 'devData'; 
const DB_URI = file === 'production' ? `"Database access details here"` : `"mongodb://localhost:27017/NCNews${file === 'test' ? '_test' : ''}"`;
return `${file === 'production' ? '/*\n' : ''}module.exports = {
articleData: require('../seed/${dirName}/articles.json'),
commentData: require('../seed/${dirName}/comments.json'),
topicData:   require('../seed/${dirName}/topics.json'),
userData:    require('../seed/${dirName}/users.json'), 
DB_URI: ${DB_URI}
}; ${file === 'production' ? '\n*/' : ''}`;
}