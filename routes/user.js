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
        res.jsonp({
          code: Message.notFound
        });
      }
      res.jsonp({
        code: Message.ok,
        user: user
      });
    })
    .catch(function(err) {
      err.message = "Can't list user file";
      next(err);
    });
});