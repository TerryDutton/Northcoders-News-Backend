const {Topics, Articles, Users, Comments} = require('../models/index.js');

exports.getUserData = function(req, res, next){
  const {username} = req.params; 

  Users.findOne({username})
  .then(user => user ? res.send({user}) : next({status: 404, message: 'Username not found.'}))
  .catch(next);
}