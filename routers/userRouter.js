const userRouter = require('express').Router();
const {getUserData} = require('../controllers/userControllers.js'); 

userRouter.get('/:username', getUserData);

module.exports = userRouter; 