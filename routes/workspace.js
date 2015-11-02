/**
 * Created by MForever78 on 15/10/27.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:workspace');
var auth = require('../middleware/auth');
var format = require('../utils/dateFormat');

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
        .then(function(assistant) {
          return res.render('workspace', {
            courseList: assistant.courseAssisting,
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
      return res.render('course', {
        session: req.session,
        assignments: assignments
      });
    });
});

app.get('/teacher/course/:id', auth('Teacher'), function(req, res, next) {
  debug("Course id:", req.params.id);
  return Course.findById(req.params.id)
    .populate('assignments attendee')
    .then(function(course) {
      debug("Found course:", course.name);
      var assignments = course.assignments.map(function (assignment) {
        assignment.dueDateFormated = format(assignment.dueDate, 'yyyy 年 MM 月 dd 日 hh: mm');
        assignment.deadlineFormated = format(assignment.deadline, 'yyyy 年 MM 月 dd 日 hh: mm');
        return assignment;
      });
      return res.render('course-management', {
        session: req.session,
        assignments: assignments,
        students: course.attendee,
        course: course
      });
    });
});

app.post('/teacher/course/add_student', auth("Teacher"), function(req, res, next) {
  // update student to include that course
  return Student.findOneAndUpdate({ studentId: req.body.student }, {
    $push: { courseTaking: req.body.course }
  }).then(function(student) {
    // update course to include that student
    return Course.findByIdAndUpdate(req.body.course, {
      $push: { attendee: student._id }
    });
  }).then(function() {
    return res.json({code: 0});
  });
});


module.exports = app;