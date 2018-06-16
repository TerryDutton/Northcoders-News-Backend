const userRouter = require('express').Router();
const {getUserData, getAllUsers, getArticlesByUserID, getCommentsByUserID} = require('../controllers/userControllers.js'); 

userRouter.get('/', getAllUsers); 
userRouter.get('/:username', getUserData);
userRouter.get('/:userID/comments', getCommentsByUserID);
userRouter.get('/:userID/articles', getArticlesByUserID);

module.exports = userRouter; 