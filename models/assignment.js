/**
 * Created by MForever78 on 15/10/24.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assignmentSchema = new Schema({
  course: Schema.Types.ObjectId,
  due_date: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  createAt: {
    type: Date,
    "default": new Date()
  },
  updateAt: Date
});

assignmentSchema.pre('update', function() {
  this.update({}, {$set: {updateAt: new Date()}});
});

var Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
