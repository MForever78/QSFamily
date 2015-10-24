/**
 * Created by MForever78 on 15/10/24.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = ({
  news: {
    type: Schema.Types.ObjectId,
    required: true
  },
  quote: Schema.Types.ObjectId,
  upVote: Number,
  downVote: Number,
  author: {
    type: Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    "default": new Date()
  }
});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
