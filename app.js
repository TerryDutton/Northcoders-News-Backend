const express = require('express');
const app = express(); 
const bodyParser = require('body-parser'); 
const {DB_URI} = process.env.NODE_ENV === 'production' ? process.env : require('./config/index.js');
const mongoose = require('mongoose'); 
const apiRouter = require('./routers/apiRouter.js'); 
const cors = require('cors');

mongoose.connect(DB_URI)
.then(() => console.log(`Connected to NCNews`));

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));
app.set('view engine', 'ejs'); 

app.use('/api', apiRouter);
app.get('/', (req, res, next) => res.render('pages/index'));

app.use('*', (req, res, next) => next({status:404, message: 'Page not found'}));

app.use((err, req, res, next) => {
  const {status, message} = err; 
  if (status && status !== 500) return res.status(status).send({message});
  else {
    console.log(err);
    return res.status(500).send({message: 'Internal Server Error'});
  } 
});

module.exports = app;