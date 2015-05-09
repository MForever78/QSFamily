/**
 * Created by MForever78 on 15/5/9.
 */

var express = require('express');
var app = module.exports = express();

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