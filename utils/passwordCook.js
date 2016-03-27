var crypto = require('crypto');
var saltPos = require('config').get('saltPos');

exports.cookPassword = function(key, salt) {
  var hash = crypto.createHash('sha512');
  return hash.update(key.slice(0, saltPos))
    .update(salt)
    .update(key.slice(saltPos))
    .digest('base64');
}

exports.checkUsernameReg = /^[A-Za-z0-9_\u4e00-\u9fa5]{6,20}$/;
exports.checkPasswordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
