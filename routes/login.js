/**
 * Created by MForever78 on 15/5/1.
 */

var express = require('express');
var app = module.exports = express();
var debug = require('debug')('QSFamily:loginRoute');
var encrypt = require('../token-encryptor').encrypt;

app.post('/', function (req, res, next) {
  debug("Begin to auth");
  var hour = 60;
  var expireTime = req.body.rememberMe ? hour * 24 * 7 : hour / 2;

  // if user has logged in, update expire time
  if (req.user) {
    var token = jwt.sign(req.user, jwtSecret, { expiresInMinutes: expireTime });
    return res.json({
      code: Message.ok,
      token: token
    });
  }

  // if not enough information given, failed the request
  if (!req.body.username || !req.body.password || !req.body.role) {
    debug("Not enough info given");
    return res.json({
      code: Message.badRequest
    });
  }

  Login(req.body.role, req.body.username, req.body.password)
    .then(function(profile) {
      if (!profile) {
        debug("Auth failed");
        res.json({
          code: 1
        });
      } else {
        debug("Auth succeed");
        var token = encrypt(profile, {expireInMinutes: expireTime});
        res.json({
          code: Message.ok,
          token: token,
          profile: {
            name: profile.name,
            role: profile.role
          }
        });
      }
    }).catch(function(err) {
      err.message = "Login failed";
      next(err);
    });
});

