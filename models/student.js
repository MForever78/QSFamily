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

  course_taking: [Schema.Types.ObjectId]
});

var Student = User.discriminator('student', studentSchema);
module.exports = Student;
