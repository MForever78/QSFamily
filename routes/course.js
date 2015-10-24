var app = require('express')();

app.get('/', function(req, res, next) {
  res.render('course-list');
});

module.exports = app;