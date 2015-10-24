/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  salt: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  createAt: {
    type: Date,
    "default": new Date()
  },

  updateAt: Date
}, {
    discriminatorKey: 'role'
});

userSchema.pre('update', function() {
  this.update({}, {$set: {updateAt: new Date()}});
});

var User = mongoose.model('User', userSchema);

module.exports = User;
