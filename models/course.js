/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  "description": {
    type: String
  },

  attendee: [Schema.Types.ObjectId],

  attachment_category: [Schema.Types.ObjectId]
  create_at: {
    type: Date,
    "default": Date.now()
  },
  update_at: Date
});

courseSchema.post('save', function() {
  this.update_at = Date.now();
});

var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
