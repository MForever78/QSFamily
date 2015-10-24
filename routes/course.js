var app = require('express')();

app.get('/', function(req, res, next) {
  var editable = req.session.user && req.session.user.role === 'Teacher';
  var courseList = [];
  res.render('course-list', {
    session: req.session,
    courseList: courseList
  });
});

module.exports = app;
