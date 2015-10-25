/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var studentSchema = new Schema({
  student_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  phone: String,
  email: String,
  qq: String,
  gender: String,

  course_taking: [{
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
    update_at: Date,
    attachment_url: String,
    remark: String
  }]
}, {
  discriminatorKey: 'role'
});

var Student = User.discriminator('Student', studentSchema);
module.exports = Student;
