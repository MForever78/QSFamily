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

  attendee: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],

  attachmentCategory: [{
    type: Schema.Types.ObjectId,
    ref: 'AttachmentCategory'
  }],

  assignments: [{
    type: Schema.Types.ObjectId,
    ref: 'Assignment'
  }],

  createAt: {
    type: Date,
    "default": new Date()
  },
  updateAt: Date
});

// delete cascade to Assignment, Student, Assistant and AttachmentCategory
courseSchema.pre('remove', function(next) {
  var delAssignments = Assignment.remove({ course: this._id });
  var popFromStudent = Student.update({ courseTaking: this._id }, {
    $pop: { courseTaking: this._id }
  });
  var popFromAssistant = Assistant.update({ courseAssisting: this._id }, {
    $pop: { courseAssisting: this._id }
  });
  var delAttachmentCate = AttachmentCategory.remove({ course: this._id });
  Promise.all([delAssignments, popFromStudent, popFromAssistant, delAttachmentCate])
    .then(function() {
      next();
    });
});

courseSchema.pre('update', function() {
  this.update({}, { $set: { updateAt: new Date() } });
});

var Course = mongoose.model('Course', courseSchema);
module.exports = Course;
