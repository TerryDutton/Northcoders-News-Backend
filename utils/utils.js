const faker = require('faker');

exports.crossRefIDsWith = function(docs, key){
  return docs.reduce((acc, doc) => {
  acc[doc[key]] = doc._id;
  return acc;
  }, {});
}

exports.formatArticleData = function(articleData, topicRef, userRef){
  return articleData.map(function(article){
    const belongs_to = topicRef[article.topic];
    const created_by = userRef[article.created_by.toLowerCase()];
    return {...article, belongs_to, created_by };
  });
};

exports.formatComments = function(commentData, articleRef, userRef){
  return commentData.map(function(comment){
    let {belongs_to, created_by} = comment;
    belongs_to = articleRef[belongs_to];
    created_by = userRef[created_by.toLowerCase()]; 
    return {...comment, belongs_to, created_by};
  });
};

exports.createComments = function(n, userData, articleData){
  return Array.from({length: n}, () => {
    const x = ~~(Math.random() * userData.length);
    const y = ~~(Math.random() * articleData.length);
    const z = ~~(Math.random() * 101);
    return {
      body: faker.lorem.sentence(), 
      created_by: userData[x].username, 
      belongs_to: articleData[y].title, 
      votes: z, 
      created_at: Date.now()
    };
  });
};

exports.modifyArticleData = function(articleData, userData){
  return articleData.map(function(article){
    const x = ~~(Math.random() * userData.length);
    const y = ~~(Math.random() * 101);
    return {...article, created_by: userData[x].username, votes: y };
  });
}