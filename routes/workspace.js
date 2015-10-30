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
        .then(function(user) {
          return res.render('workspace', {
            courseList: user.courseTaking,
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

app.get('/student/course/:id', auth('Student'), function(req, res, next) {
  return Student.findById(req.session.user._id)
    .populate('assignments.reference')
    .then(function(user) {
      var assignments = user.assignments.filter(function(assignment) {
        return assignment.course === req.params.id;
      });
      return res.render('assignment', {
        session: req.session,
        assignments: assignments
      });
    });
});

app.get('/teacher/course/:id', auth('Teacher'), function(req, res, next) {
  debug("Course id:", req.params.id);
  return Course.findById(req.params.id)
    .populate('assignments')
    .then(function(course) {
      debug("fine course:", course);
      return res.render('assignment', {
        session: req.session,
        assignments: course.assignments
      });
    });
});

module.exports = app;