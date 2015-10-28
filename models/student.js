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
  qq: String,
  gender: String,

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
    visible: Boolean,
    complete: Boolean,
    updateAt: Date,
    attachmentUrl: String,
    remark: String
  }]
}, {
  discriminatorKey: 'role'
});

var Student = User.discriminator('Student', studentSchema);
module.exports = Student;
