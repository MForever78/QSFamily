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
    required: true
  },

  content: String,

  comments: [Schema.Types.ObjectId],
  create_at: {
    type: Date,
    "default": Date.now(),
  },
  update_at: Date
});

newsSchema.post('save', function() {
  this.update_at = Date.now();
});

var News = mongoose.model('News', newsSchema);
module.exports = News;
