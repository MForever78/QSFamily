/**
 * Created by MForever78 on 15/5/5.
 */

var saltPos = require('config').get('saltPos');
var crypto = require('crypto');
var debug = require('debug')('login');

module.exports = login;

function login(role, username, password) {
  debug('logging in into ' + role);
  debug('with username: ' + username);
  debug('password: ' + password);
  return Knex(role)
    .select('salt', 'password', 'id')
    .where({ username: username })
    .then(function (rows) {
      if (rows.length === 0) {
        debug('no username found');
        return false;
      } else {
        debug('user found: ' + rows[0].salt);
        if (authenticate(rows[0], password)) {
          var profile = {
            role: role,
            username: username,
            userid: rows[0].id
          };
          return profile;
        } else {
          debug('wrong password');
          return false;
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
  return user.password === password;
}

