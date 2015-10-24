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

  attachmentCategory: [Schema.Types.ObjectId],

  createAt: {
    type: Date,
    "default": new Date()
  },
  updateAt: Date
});

courseSchema.pre('update', function() {
  this.update({}, { $set: { updateAt: new Date() } });
});

var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
