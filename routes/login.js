/**
 * Created by MForever78 on 15/10/22.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:login');
var crypto = require('crypto');
var saltPos = require('config').get('saltPos');

function authenticate(user, key) {
  var hash = crypto.createHash('sha512');
  var password = hash.update(key.slice(0, saltPos))
    .update(user.salt)
    .update(key.slice(saltPos))
    .digest('base64');
  return user.password === password;
}

app.get('/', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/workspace');
  }
  res.render('login', {session: req.session});
});

app.post('/', function(req, res, next) {
  debug('Begin login auth');

  User.findOne({username: req.body.username})
    .then(function(user) {
      if (!user) {
        debug("Username doesn't exist");
        return res.render('login', {
          message: {
            type: 'error',
            text: '用户名或密码错误'
          }
        });
      }
      debug("Found username:", user.username);
      if (authenticate(user, req.body.password)) {
        debug('Auth passed for user:', user.username);
        var hour = 3600000;
        req.session.cookie.maxAge = req.body.remember ? hour * 24 * 30 * 6 : null;
        req.session.user = {
          _id: user._id,
          username: user.username,
          name: user.name,
          role: user.role
        };
        res.redirect('/workspace');
      } else {
        return res.render('login', {
          message: {
            type: 'error',
            text: '用户名或密码错误'
          }
        });
      }
    });
});

module.exports = app;
