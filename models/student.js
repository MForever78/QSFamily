/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var studentSchema = new Schema({
  studentId: {
    type: String,
    required: true
  },

  phone: String,
  email: String,
  gender: String,
  department: String,

  courseTaking: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  assignments: [{
    reference: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment'
    },
    grade: Number,
    visible: {
      type: Boolean,
      "default": false
    },
    complete: {
      type: Boolean,
      "default": false
    },
    rank: {
      type: Number,
      "default": 0
    },
    late: {
      type: Boolean,
      "default": false
    },
    updateAt: Date,
    attachmentUrl: String,
    remark: String
  }],
  reminder: {
    dueDate: {
      type: Boolean,
      "default": false
    },
    deadline: {
      type: Boolean,
      "default": true
    }
  }
}, {
  discriminatorKey: 'role'
});

var Student = User.discriminator('Student', studentSchema);
module.exports = Student;
