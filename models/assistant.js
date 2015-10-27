/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var assistantSchema = new Schema({
  email: String,
  phone: String,
  courseAssisting: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  discriminatorKey: 'role'
});

var Assistant = User.discriminator('Assistant', assistantSchema);
module.exports = Assistant;
