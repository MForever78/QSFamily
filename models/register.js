/**
 * Created by MForever78 on 15/10/31.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registerSchema = new Schema({
  studentId: String,
  name: String,
  department: String,
  gender: String,
  course: Schema.Types.ObjectId
});

var Register = mongoose.model('Register', registerSchema);
module.exports = Register;
