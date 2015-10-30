/**
 * Created by MForever78 on 15/10/24.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assignmentSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  dueDate: {
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

// delete cascade to Student
assignmentSchema.pre('remove', function() {
  Student.update({ "assignments.reference": this._id }, {
    $pop: { "assignments.reference": this._id }
  }).exec();
});

assignmentSchema.pre('update', function() {
  this.update({}, {$set: {updateAt: new Date()}});
});

var Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
