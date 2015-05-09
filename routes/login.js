/**
 * Created by MForever78 on 15/5/1.
 */

var express = require('express');
var app = module.exports = express();
var cipherSecret = require('config').get('cipherSecret');
var jwt = require('jsonwebtoken');
var jwtSecret = require('config').get('jwtSecret');

app.post('/', function (req, res, next) {
  var hour = 60;
  var expireTime = req.body.rememberMe ? hour * 24 * 7 : hour / 2;

  // if user has logged in, update expire time
  if (req.user) {
    var token = jwt.sign(req.user, jwtSecret, { expiresInMinutes: expireTime });
    res.json({
      code: 0,
      token: token
    });
  }

  // if not enough information given, failed the request
  if (!req.body.username || !req.body.password || !req.body.role) {
    res.json({
      code: 1
    });
  }

  Login(req.body.role, req.body.username, req.body.password)
    .then(function(profile) {
      if (!profile) {
        res.json({
          code: 1
        })
      } else {
        var encrypted = { token: encryptAesSha256(cipherSecret, JSON.stringify(profile)) };
        var token = jwt.sign(encrypted, jwtSecret, {expireInMinutes: expireTime});
        res.json({
          code: 0,
          token: token,
          userid: profile.userid
        });
      }
    })
    .catch(function(err) {
      err.message = "Login failed";
      next(err);
    });
});

function encryptAesSha256(secret, str) {
  if (typeof(secret) !== 'string')
    throw TypeError('cipher secret should be a string');
  if (typeof(str) !== 'string')
    throw TypeError('value to be encrypt should be a string');
  var cipher = crypto.createCipher('aes-256-cbc', secret);
  return cipher.update(str).final('base64');
}
