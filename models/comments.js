const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  belongs_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
    required: true
  },
  created_at: {
    type: Number,
    default: new Date().getTime(), 
    required: true
  },
  votes: {
    type: Number,
    default: 0, 
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

module.exports = mongoose.model('comments', CommentSchema);
