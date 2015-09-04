var express = require('express');
var app = module.exports = express();
var debug = require('debug')('QSFamily:courseRoute');

app.get('/', function(req, res, next) {
  debug('Getting course list');
  Course.getCourseList()
    .then(function(courseList) {
      res.json({
        code: Message.ok,
        courseList: courseList
      });
    }).catch(function(err) {
      err.message = "Get course list error";
      next(err);
    });
});

