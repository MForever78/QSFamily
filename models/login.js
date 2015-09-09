/**
 * Created by MForever78 on 15/5/5.
 */

var saltPos = require('config').get('saltPos');
var crypto = require('crypto');
var debug = require('debug')('QSFamily:loginModel');

module.exports = login;

function login(username, password) {
  debug('login with username: ' + username);
  debug('password: ' + password);
  return Knex('user')
    .select('salt', 'password', 'id', 'role', 'name')
    .where({ username: username })
    .then(function (rows) {
      if (rows.length === 0) {
        debug('no username found');
        return false;
      } else {
        debug('user found');
        if (authenticate(rows[0], password)) {
          debug('auth passed:', rows[0]);
          return {
            role: rows[0].role,
            username: username,
            id: rows[0].id,
            name: rows[0].name
          };
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

