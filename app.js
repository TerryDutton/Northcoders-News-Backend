const express = require('express');
const app = express(); 
const bodyParser = require('body-parser'); 
const {DB_URI} = process.env.NODE_ENV === 'production' ? process.env : require('./config/index.js');
const mongoose = require('mongoose'); 
const apiRouter = require('./routers/apiRouter.js'); 

mongoose.connect(DB_URI)
.then(() => console.log(`Connected to NCNews`));

app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'ejs'); 

app.use('/api', apiRouter);
app.get('/', (req, res, next) => res.render('pages/index'));

app.use('*', (req, res, next) => next({status:404, message: 'Page not found'}));

app.use((err, req, res, next) => {
  if (err.status && err.status !== 500) return res.status(err.status).send({message: err.message});
  else {
    console.log(err);
    return res.status(500).send({message: 'Internal Server Error'});
  } 
});

module.exports = app;