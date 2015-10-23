/**
 * Created by MForever78 on 15/10/23.
 */

var Schema = require('mongoose').Schema;

var roles = ["teacher", "assistant", "student"];

var roleValidator = function(value) {
  return roles.indexOf(value) !== -1;
};

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

  role: {
    type: String,
    required: true,
    validate: roleValidator
  },

  create_at: {
    type: Date,
    required: true,
    "default": new Date()
  },

  update_at: {
    type: Date
  }
});

userSchema.post('save', function() {
  this.update_at = new Date();
});

module.exports = userSchema;
