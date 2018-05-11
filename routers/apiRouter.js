const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter'); 
const articlesRouter = require('./articlesRouter'); 
const commentsRouter = require('./commentsRouter'); 
const userRouter = require('./userRouter'); 

// apiRouter.use('/', /*...*/); --> for the root; serves an HTML page of all endpoints. 

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter); 
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', userRouter); 

module.exports = apiRouter;