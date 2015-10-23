/**
 * Created by MForever78 on 15/10/23.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roles = ["teacher", "assistant", "student"];

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

  create_at: {
    type: Date,
    "default": new Date()
  },

  update_at: {
    type: Date
  }
}, {
    discriminatorKey: 'role'
});

userSchema.post('save', function() {
  this.update_at = new Date();
});

var User = mongoose.model('User', userSchema);

module.exports = User;
