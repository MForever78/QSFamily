/**
 * Created by MForever78 on 15/5/9.
 */

var express = require('express');
var app = module.exports = express();
var debug = require('debug')('QSFamily:userRoute');

app.get('/:role/:userid', function(req, res, next) {
  User(req.params.role, req.params.userid)
    .then(function(user) {
      if (!user) {
        res.json({
          code: Message.notFound
        });
      }
      res.json({
        code: Message.ok,
        user: user
      });
    })
    .catch(function(err) {
      err.message = "Can't list user file";
      next(err);
    });
});

app.get('/', function(req, res) {
  if (!req.user) {
    return res.json({
      code: Message.notFound
    });
  }
  debug('User token verified: ', req.user);
  res.json({
    code: Message.ok,
    user: user
  });
});

