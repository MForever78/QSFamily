/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  content: String,

  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createAt: {
    type: Date,
    "default": new Date()
  },
  updateAt: Date
});

newsSchema.pre('update', function() {
  this.update({}, {$set: {updateAt: new Date()}});
});

var News = mongoose.model('News', newsSchema);
module.exports = News;
