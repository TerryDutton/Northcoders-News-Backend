process.env.NODE_ENV = 'test';
const app = require('../app'); 
const {expect} = require('chai'); 
const request = require('supertest')(app); 
const mongoose = require('mongoose'); 
const seedDB = require('../seed/seed.js');
let   {articleData, commentData, topicData, userData} = require('../config/index.js'); 
const {modifyArticleData, createComments} = require('../utils/utils.js');
const {Articles, Comments, Topics, Users} = require('../models/index.js');

articleData = modifyArticleData(articleData, userData); 
if (!commentData) commentData = createComments(articleData.length * 3, userData, articleData);

describe('/', () => {
  let articleDocs, commentDocs, topicDocs, userDocs;
  beforeEach(() => {
    return seedDB(articleData, commentData, topicData, userData)
    .then(docs => [articleDocs, commentDocs, topicDocs, userDocs] = docs);
  });
  after(() => mongoose.disconnect());

  describe('/api', () => {

    describe('/topics', () => {
      it('GET returns status 200 and a list of all topics', () => {
        return request.get('/api/topics')
        .expect(200)
        .then(response => {
          
          const {topics} = response.body;
          expect(topics.length).to.equal(topicDocs.length);
          expect(topics[0]._id).to.equal(topicDocs[0]._id.toString()); 
        });
      });

      it('GET returns all articles of a given topic  with the relevant request and a topic ID.', () => {
        return request.get(`/api/topics/${topicDocs[0]._id}/articles`)
        .expect(200)
        .then(response => {
          const {articles} = response.body;
          expect(articles.length).to.equal(2); 
          expect(articles[0].belongs_to).to.equal(`${topicDocs[0]._id}`);
          expect(articles[1].belongs_to).to.equal(`${topicDocs[0]._id}`);
        });
      });

      it('returns a 400 bad request status for an invalid topic ID.', () => {
        return request.get('/api/topics/abc123/articles')
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          expect(message).to.equal('Bad request: Invalid topic ID.');
        });
      });

      it('returns a 400 bad request status for a valid Mongo ID that is not a topic ID.', () => {
        return request.get(`/api/topics/${commentDocs[0]._id}/articles`)
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          expect(message).to.equal('Bad request: Invalid topic ID.');
        });
      });

      it('can add a new article to a topic with a successful POST request.', () => {
        const newArticle = {
          title: "Henghis Khan and his Mongo Hoardes", 
          body: "Ask Rory if you're curious",
          created_by: userDocs[0]._id 
        };
        return request.post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(201)
        .then(response => {
          const {article} = response.body;
          expect(article._id).to.be.a('string');
          expect(article.votes).to.equal(0);
          expect(article.title).to.equal(newArticle.title); 
          expect(article.body).to.equal(newArticle.body); 
          expect(article.created_by).to.equal(`${newArticle.created_by}`); 
          expect(article.belongs_to).to.equal(`${topicDocs[0]._id}`);
        });
      });

      it('returns status 400 and does not post the article if provided an invalid topic ID.', () => {
        const newArticle = {
          title: "Henghis Khan and his Mongo Hoardes", 
          body: "Ask Rory if you're curious",
          created_by: userDocs[0]._id 
        };
        return request.post(`/api/topics/abc123/articles`)
        .send(newArticle)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([Articles.find(), message]);
        })
        .then(([articles, message]) => {
          expect(message).to.equal('Bad request: Invalid topic ID, or article data mising/invalid.');
          expect(articles.length).to.equal(articleDocs.length); 
        });
      });

      it('returns status 400 and does not post the article if provided a valid Mongo ID that is not a topic ID.', () => {
        const newArticle = {
          title: "Henghis Khan and his Mongo Hoardes", 
          body: "Ask Rory if you're curious",
          created_by: userDocs[0]._id 
        };
        return request.post(`/api/topics/${userDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([Articles.find(), message]);
        })
        .then(([articles, message]) => {
          expect(message).to.equal('Bad request: Invalid topic ID, or article data mising/invalid.');
          expect(articles.length).to.equal(articleDocs.length); 
        });
      });

      it('returns status 400 and does not post the article if the article invalidates the schema.', () => {
        const newArticle = {
          title: "Henghis Khan and his Mongo Hoardes", 
          body: "Ask Rory if you're curious",
          created_by: '1234567890'
        };
        return request.post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([Articles.find(), message]);
        })
        .then(([articles, message]) => {
          expect(message).to.equal('Bad request: Invalid topic ID, or article data mising/invalid.');
          expect(articles.length).to.equal(articleDocs.length); 
        });
      });

      it('returns status 400 and does not post the article if the article\'s "created-by" field is a valid mongoID that is not a valid userID.', () => {
        const newArticle = {
          title: "Henghis Khan and his Mongo Hoardes", 
          body: "Ask Rory if you're curious",
          created_by: `${commentDocs[0]._id}`
        };
        return request.post(`/api/topics/${topicDocs[0]._id}/articles`)
        .send(newArticle)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([Articles.find(), message]);
        })
        .then(([articles, message]) => {
          expect(message).to.equal('Bad request: Invalid topic ID, or article data mising/invalid.');
          expect(articles.length).to.equal(articleDocs.length); 
        });
      });

    }); // <--- End of 'Describe "/api/topics"'

    describe('/articles', () => {

      it('GET returns status 200 and a list of all articles.', () => {
        return request.get('/api/articles')
        .expect(200)
        .then(response => {
          const {articles} = response.body; 
          expect(articles.length).to.equal(articleDocs.length);
          expect(articles[2]._id).to.equal(`${articleDocs[2]._id}`); 
          expect(articles[0].title).to.equal(articleDocs[0].title);
          expect(articles[1].body).to.equal(articleDocs[1].body); 
        });
      });

      it('GET returns a specific article when supplied an article ID.', () => {
        return request.get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(response => {
          const {article} = response.body;
          expect(article._id).to.equal(`${articleDocs[0]._id}`);
          expect(article.title).to.equal(articleDocs[0].title); 
          expect(article.body).to.equal(articleDocs[0].body);
          expect(article.belongs_to).to.equal(`${articleDocs[0].belongs_to}`);
          expect(article.votes).to.equal(articleDocs[0].votes);
          expect(article.created_by).to.equal(`${articleDocs[0].created_by}`);
        });
      });

      it('returns a 404 page-not-found status when provided an invalid article ID.', () => {
        return request.get('/api/articles/abc123')
        .expect(404)
        .then(response => {
          const {message} = response.body; 
          expect(message).to.equal('Page not found (Invalid article ID).'); 
        });
      });

      it('returns a 404 page-not-found status when provided a valid mongoID that is not an article ID.', () => {
        return request.get(`/api/articles/${commentDocs[0]._id}`)
        .expect(404)
        .then(response => {
          const {message} = response.body; 
          expect(message).to.equal('Page not found (Invalid article ID).'); 
        });
      });

      it('GET returns all comments on a given article with the relevant request and an article ID.', () => {
        return request.get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(response => {
          const {comments} = response.body;
          const testComments = commentDocs.filter(({belongs_to}) => `${belongs_to}` === `${articleDocs[0]._id}`);
          expect(comments.every(({belongs_to}) => belongs_to === `${articleDocs[0]._id}`)).to.be.true;
          expect(comments.every(({body}, i) => body === testComments[i].body)).to.be.true;
        });
      });

      it('returns a 400 bad request when attempting to find comments with an invalid article ID.', () => {
        return request.get('/api/articles/abc123/comments')
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          expect(message).to.equal('Bad request: Invalid article ID.');
        });
      });

      it('returns a 400 bad request when attempting to find comments with a valid mongoID that is not an article ID.', () => {
        return request.get(`/api/articles/${userDocs[0]._id}/comments`)
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          expect(message).to.equal('Bad request: Invalid article ID.');
        });
      });
    
      it('can add a new comment to an article with a successful POST request', () => {
        const time = new Date().getTime();
        const newComment = {
          body: "I'm in ur code, addin to ur commentz",
          created_by: userDocs[0]._id, 
          created_at: time 
        };        
        return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(201)
        .then(response => {
          const {comment} = response.body;
          expect(comment._id).to.be.a('string'); 
          expect(comment.body).to.equal(newComment.body);
          expect(comment.belongs_to).to.equal(`${articleDocs[0]._id}`);
          expect(comment.votes).to.equal(0);
          expect(comment.created_at).to.equal(time);
        });
      });

      it('returns a 400 bad request and does not post the comment if provided an invalid article ID.', () => {
        const time = new Date().getTime();
        const newComment = {
          body: "I'm in ur code, addin to ur commentz",
          created_by: userDocs[0]._id, 
          created_at: time 
        };        
        return request.post(`/api/articles/9101112/comments`)
        .send(newComment)
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          return Promise.all([Comments.find(), message]);
        })
        .then(([comments, message]) => {
          expect(comments.length).to.equal(commentDocs.length);
          expect(message).to.equal('Bad request: invalid article ID, or invalid comment data.');
        });
      });

      it('returns a 400 bad request and does not post the comment if provided a valid mongoID that is not an article ID.', () => {
        const time = new Date().getTime();
        const newComment = {
          body: "I'm in ur code, addin to ur commentz",
          created_by: userDocs[0]._id, 
          created_at: time 
        };        
        return request.post(`/api/articles/${userDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          return Promise.all([Comments.find(), message]);
        })
        .then(([comments, message]) => {
          expect(comments.length).to.equal(commentDocs.length);
          expect(message).to.equal('Bad request: invalid article ID, or invalid comment data.');
        });
      });

      it('returns a 400 bad request and does not post the comment if the comment violates the comment schema.', () => {
        const time = new Date().getTime();
        const newComment = {
          body: undefined,
          created_by: userDocs[0]._id, 
          created_at: time 
        };        
        return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          return Promise.all([Comments.find(), message]);
        })
        .then(([comments, message]) => {
          expect(comments.length).to.equal(commentDocs.length);
          expect(message).to.equal('Bad request: invalid article ID, or invalid comment data.');
        });
      });

      it('returns a 400 bad request and does not post the comment if the comment is signed with a valid mongoID that is not an article ID.', () => {
        const time = new Date().getTime();
        const newComment = {
          body: "I'm in ur code, addin to ur commentz",
          created_by: topicDocs[0]._id, 
          created_at: time 
        };        
        return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          return Promise.all([Comments.find(), message]);
        })
        .then(([comments, message]) => {
          expect(comments.length).to.equal(commentDocs.length);
          expect(message).to.equal('Bad request: invalid article ID, or invalid comment data.');
        });
      });

      it('increments the vote count on an article with a successful PUT request.', () => {
          return request.put(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(200)
          .then(response => {
            const {article} = response.body; 
            expect(article._id).to.equal(`${articleDocs[0]._id}`);
            expect(article.votes).to.equal(articleDocs[0].votes+1);
        });
      });

      it('decrements the vote count on an article with a successful PUT request.', () => {
        return request.put(`/api/articles/${articleDocs[0]._id}?vote=down`)
        .expect(200)
        .then(response => {
          const {article} = response.body; 
          expect(article._id).to.equal(`${articleDocs[0]._id}`);
          expect(article.votes).to.equal(articleDocs[0].votes-1);
        });
      });

      it('returns a 400 bad request if the query does not equal "up" or "down", and does not affect the article vote-count.', () => {
        return request.put(`/api/articles/${articleDocs[0]._id}?vote=bananas`)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([message, Articles.findById(`${articleDocs[0]._id}`)]);
        })
        .then(([message, article]) => {
          expect(message).to.equal('Bad request: vote query should be either "up" or "down".');
          expect(article.votes).to.equal(articleDocs[0].votes);
        });
      });

      it('returns a 400 bad request and causes no problems if a PUT request is made to an invalid article ID.', () => {
        return request.put(`/api/articles/${commentDocs[0]._id}?vote=down`)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([message, Comments.findById(`${commentDocs[0]._id}`), Articles.find()]);
        })
        .then(([message, comment, articles]) => {
          expect(comment.votes).to.equal(commentDocs[0].votes);
          expect(articles.length).to.equal(articleDocs.length); 
          expect(message).to.equal('Bad request: invalid article ID.');
        });
      });

    }); // <--- End of 'Describe "/api/articles"'

    describe('/comments', () => {

      it('increments the vote count on a comment with a successful PUT request.', () => {
        return request.put(`/api/comments/${commentDocs[0]._id}?vote=up`)
        .expect(200)
        .then(response => {
          const {comment} = response.body; 
          expect(comment._id).to.equal(`${commentDocs[0]._id}`);
          expect(comment.votes).to.equal(commentDocs[0].votes+1);
        });
      });

      it('decrements the vote count on a comment with a successful PUT request.', () => {
        return request.put(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(response => {
          const {comment} = response.body; 
          expect(comment._id).to.equal(`${commentDocs[0]._id}`);
          expect(comment.votes).to.equal(commentDocs[0].votes-1);
        });
      });

      it('returns a 400 bad request if the query does not equal "up" or "down", and does not affect the comment vote-count.', () => {
        return request.put(`/api/comments/${commentDocs[0]._id}?vote=bananas`)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([message, Comments.findById(`${commentDocs[0]._id}`)]);
        })
        .then(([message, comment]) => {
          expect(message).to.equal('Bad request: vote query should be either "up" or "down".');
          expect(comment.votes).to.equal(commentDocs[0].votes);
        });
      });

      it('returns a 400 bad request and causes no problems if a PUT request is made to an invalid article ID.', () => {
        return request.put(`/api/comments/${articleDocs[0]._id}?vote=down`)
        .expect(400)
        .then(response => {
          const {message} = response.body;
          return Promise.all([message, Articles.findById(`${articleDocs[0]._id}`), Comments.find()]);
        })
        .then(([message, article, comments]) => {
          expect(article.votes).to.equal(articleDocs[0].votes);
          expect(comments.length).to.equal(commentDocs.length); 
          expect(message).to.equal('Bad request: invalid comment ID.');
        });
      });

      it('deletes a comment with a successful DELETE request.', () => {
        return request.delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(200)
        .then(response => {
          const {comment} = response.body; 
          return Promise.all([Comments.find(), comment]);
        })
        .then(([remainingComments, deletedComment]) => {
          expect(deletedComment.body).to.equal(commentDocs[0].body);
          expect(remainingComments[0].body).to.equal(commentDocs[1].body);
          const remainingCommentIDs = remainingComments.map(comment => `${comment._id}`);
          expect(remainingCommentIDs.indexOf(deletedComment._id)).to.equal(-1); 
        });
      });

      it('returns a 400 bad request and does not delete any comments if provided with an invalid comment ID.', () => {
        return request.delete('/api/comments/45962')
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          return Promise.all([Comments.find(), message]);
        })
        .then(([comments, message]) => {
          expect(comments.length).to.equal(commentDocs.length);
          expect(message).to.equal('Bad request: invalid comment ID.');
        });
      });

      it('returns a 400 bad request and does not delete any comments if provided with a valid mongoID that is not a comment ID.', () => {
        return request.delete(`/api/comments/${articleDocs[0]._id}`)
        .expect(400)
        .then(response => {
          const {message} = response.body; 
          return Promise.all([Comments.find(), Articles.findById(`${articleDocs[0]._id}`), message]);
        })
        .then(([comments, article, message]) => {
          expect(comments.length).to.equal(commentDocs.length);
          expect(message).to.equal('Bad request: invalid comment ID.');
          expect(article.body).to.equal(articleDocs[0].body);
        });
      });

    }); // <-- End of 'Describe "/api/comments"'

    describe('/users', () => {
      it('GET returns 200 and a JSON object of a user\'s details when provided a username.', () => {
        return request.get(`/api/users/${userDocs[0].username}`)
        .expect(200)
        .then(response => {
          const {user} = response.body; 
          expect(user).to.be.an('object'); 
          expect(user._id).to.equal(`${userDocs[0]._id}`); 
          expect(user.username).to.equal(userDocs[0].username); 
          expect(user.name).to.equal(userDocs[0].name); 
          expect(user.avatar_url).to.equal(userDocs[0].avatar_url); 
        });
      });

      it('returns a 404 page-not-found if provided an invalid username.', () => {
        return request.get('/api/users/userMcUseFace')
        .expect(404)
        .then(response => {
          const {message} = response.body; 
          expect(message).to.equal('Username not found.');
        });
      });

    }); // <--- End of 'Describe "/api/users"'

  }); // <--- End of 'Describe "/api"'

}); // <--- End of 'Describe "/"'