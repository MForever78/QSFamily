/**
 * Created by MForever78 on 15/6/9.
 */

var jwt = require('jsonwebtoken');
var cipherSecret = require('config').get('cipherSecret');
var jwtSecret = require('config').get('jwtSecret');

function encryptAesSha256(secret, str) {
  if (typeof(secret) !== 'string')
    throw TypeError('cipher secret should be a string');
  if (typeof(str) !== 'string')
    throw TypeError('value to be encrypt should be a string');
  var cipher = require('crypto').createCipher('aes-256-cbc', secret);
  var ciphered = cipher.update(str, 'utf8', 'base64');
  ciphered += cipher.final('base64');
  return ciphered;
}

exports.decrypt = function(token) {
  var decipher = require('crypto').createDecipher('aes-256-cbc', cipherSecret);
  var deciphered = decipher.update(token, 'base64', 'utf8');
  deciphered += decipher.final('utf8');
  return JSON.parse(deciphered);
};

exports.sign = function(data, opt) {
  var encrypted = { token: encryptAesSha256(cipherSecret, JSON.stringify(data)) };
  return jwt.sign(encrypted, jwtSecret, opt);
};

