/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var teacherSchema = new Schema({
  email: String
}, {
  discriminatorKey: 'role'
});

var Teacher = User.discriminator('Teacher', teacherSchema);
module.exports = Teacher;
