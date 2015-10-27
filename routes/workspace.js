/**
 * Created by MForever78 on 15/10/27.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:workspace');
var auth = require('../middleware/auth');

app.get('/', function(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  switch(req.session.user.role) {
    case "Teacher":
      // Teachers can see all the courses
      return Course.find({})
        .then(function(courseList) {
          return res.render('workspace', {
            courseList: courseList,
            session: req.session
          });
        });
    case "Student":
      // Students can only see the courses they are taking
      return Student.findById(req.session.user._id)
        .populate('courseTaking')
        .then(function(courseList) {
          return res.render('workspace', {
            courseList: courseList,
            session: req.session
          });
        });
    case "Assistant":
      // Assistants can see all the courses they are managing
      return Assistant.findById(req.session.user._id)
        .populate('courseAssisting')
        .then(function(courseList) {
          return res.render('workspace', {
            courseList: courseList,
            session: req.session
          });
        });
  }
});

module.exports = app;