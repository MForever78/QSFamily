/**
 * Created by MForever78 on 15/5/5.
 */

var config = require('config');
var saltPos = config.get('saltPos');
var cipherSecret = config.get('cipherSecret');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var jwtSecret = require('config').get('jwtSecret');
var debug = require('debug')('login');

module.exports = login;

var loginFailed = { code: 1 };

function login(role, data) {
  debug('logging in into ' + role);
  debug('with username: ' + data.username);
  debug('password: ' + data.password);
  return knex(role)
    .select('salt', 'password')
    .where({ username: data.username })
    .then(function (rows) {
      if (rows.length === 0) {
        debug('no username found');
        return loginFailed;
      } else {
        if (authenticate(rows[0], data.password)) {
          var profile = {
            role: role,
            username: data.username
          };
          var encrypted = { token: encryptAesSha256(cipherSecret, JSON.stringify(profile)) };
          var hour = 60;
          var expireTime = req.body.rememberMe ? hour * 24 * 7 : hour / 2;
          var token = jwt.sign(encrypted, jwtSecret, {expireInMinutes: expireTime});
          return {
            code: 0,
            token: token
          };
        } else {
          debug('wrong password');
          return loginFailed;
        }
      }
    });
}

function authenticate(user, key) {
  var hash = crypto.createHash('sha512');
  var password = hash.update(key.slice(0, saltPos))
    .update(user.salt)
    .update(key.slice(saltPos))
    .digest('base64');
  return key === password;
}

function encryptAesSha256(secret, str) {
  if (typeof(secret) !== 'string')
    throw TypeError('cipher secret should be a string');
  if (typeof(str) !== 'string')
    throw TypeError('value to be encrypt should be a string');
  var cipher = crypto.createCipher('aes-256-cbc', secret);
  return cipher.update(str).final('base64');
}
