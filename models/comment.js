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
  up_vote: Number,
  down_vote: Number,
  author: {
    type: Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
