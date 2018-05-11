const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter'); 
const articlesRouter = require('./articlesRouter'); 
const commentsRouter = require('./commentsRouter'); 
const userRouter = require('./userRouter'); 

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter); 
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', userRouter); 
apiRouter.get('/', (req, res, next) => res.render('pages/index'));

module.exports = apiRouter;