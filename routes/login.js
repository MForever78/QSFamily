/**
 * Created by MForever78 on 15/5/1.
 */

var express = require('express');
var app = module.exports = express();
var crypto = require('crypto');

var response = {
  loginFailed: { code: 1 },
  loginSucceed: { code: 0 }
};

app.post('/', function(req, res) {
  // TODO:
  // 1. if already logged in
  // 2. if no username or password
  knex('student')
    .select('salt', 'password')
    .where({ username: req.body.username })
    .then(function(rows) {
      if (rows.length === 0) {
        res.json(response.loginFailed);
      } else {
        if (authenticate(rows[0], req.body.password)) {
          res.session.username = req.body.username;
          if (req.body.rememberMe) {
            var hour = 3600000;
            req.session.cookie.maxAge = 7 * 24 * hour;
          }
          res.json(response.loginSucceed);
        } else {
          res.json(response.loginFailed);
        }
      }
    })
});

function authenticate(user, key) {
  var hash = crypto.createHash('sha512');
  var password = hash.update(key.slice(0, 6)).update(user.salt).update(key.slice(6)).digest('base64');
  return key === password;
}