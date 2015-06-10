/**
 * Created by MForever78 on 15/5/5.
 */

var saltPos = require('config').get('saltPos');
var crypto = require('crypto');
var debug = require('debug')('QSFamily:loginModel');

module.exports = login;

function login(role, username, password) {
  debug('logging in into ' + role);
  debug('with username: ' + username);
  debug('password: ' + password);
  return Knex(role)
    .select('salt', 'password', 'id', 'name')
    .where({ username: username })
    .then(function (rows) {
      if (rows.length === 0) {
        debug('no username found');
        return false;
      } else {
        debug('user found');
        if (authenticate(rows[0], password)) {
          debug('auth passed:', rows[0]);
          var profile = {
            role: role,
            username: username,
            userid: rows[0].id,
            name: rows[0].name
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

