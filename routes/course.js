var app = require('express')();
var auth = require('../middleware/auth');

app.get('/', function(req, res, next) {
  return Course.find({})
    .then(function(courseList) {
      return res.render('course-list', {
        session: req.session,
        courseList: courseList
      });
    });
});

app.get('/new', function(req, res, next) {
  res.render('write', {
    session: req.session,
    action: '/course',
    method: 'post'
  });
});

app.post('/', auth("Teacher"), function(req, res, next) {
  return Course.create({
    name: req.body.title,
    description: req.body.content
  }).then(function() {
    return res.json({code: 0});
  });
});

module.exports = app;
