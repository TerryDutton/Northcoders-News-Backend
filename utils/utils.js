const faker = require('faker');

exports.getCrossRefOfIDs = function(docs, key){
  return docs.reduce((acc, doc) => {
  acc[doc[key]] = doc._id;
  return acc;
}, {});}


exports.buildArticleData = function(articleData, topicRef, userDocs){
  return articleData.map(function(article){
    const x = ~~(Math.random() * userDocs.length);
    return {
      title: article.title, 
      body: article.body, 
      belongs_to: topicRef[article.topic],
      votes: 0, 
      created_by: userDocs[x]._id
    };
  });
};

exports.formatPresetComments = function(commentData, articleRef, userRef){
  return commentData.map(function(comment){
    let {belongs_to, created_by} = comment;
    belongs_to = articleRef[belongs_to];
    created_by = userRef[created_by.toLowerCase()]; 
    return {...comment, belongs_to, created_by};
  });
};

exports.createNewComments = function(n, userDocs, articleDocs){
  return Array.from({length: n}, () => {
    const x = ~~(Math.random() * userDocs.length);
    const y = ~~(Math.random() * articleDocs.length);
    return {
      body: faker.lorem.sentence(), 
      belongs_to: articleDocs[y]._id, 
      created_by: userDocs[x]._id, 
      votes: ~~(Math.random() * 101), 
      created_at: Date.now()
    };
  });
};