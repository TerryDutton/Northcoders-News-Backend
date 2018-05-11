const app = require('express')(); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 
const apiRouter = require('./routers/apiRouter.js'); 
const dbAppend = process.env.NODE_ENV === 'test' ? '_test' : '';

mongoose.connect(`mongodb://localhost:27017/NCNews${dbAppend}`)
.then(() => console.log(`Connected to NCNews${dbAppend}`));

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('*', (req, res, next) => next({status:404, message: 'Page not found'}));

app.use((err, req, res, next) => {
  return err.status !== 500 ? res.status(err.status).send({message: err.message})
  : res.status(500).send({message: 'Internal Server Error'}); 
});

module.exports = app;