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
      debug(user);
      var assignments = user.assignments.filter(function(assignment) {
        debug("Assignment:", assignment);
        debug("params:", req.params.id);
        if (!assignment.reference) return false;
        return assignment.reference.course == req.params.id;
      }).map(function(assignment) {
        assignment.reference.dueDateFormated = format(assignment.reference.dueDate, 'yyyy 年 MM 月 dd 日 hh: mm');
        assignment.reference.deadlineFormated = format(assignment.reference.deadline, 'yyyy 年 MM 月 dd 日 hh: mm');
        return assignment;
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

app.post('/teacher/course/student', auth("Teacher"), function(req, res, next) {
  // update student to include that course and its assignments
  var getStudent = Student.findOne({ studentId: req.body.student });
  var getCourse = Course.findById(req.body.course);
  return Promise.all([getStudent, getCourse])
    .then(function(result) {
      var student = result[0];
      var course = result[1];
      var cookedAssignments = course.assignments.map(function(assignment) {
        var cookedAssignment = {};
        cookedAssignment.reference = assignment;
        return cookedAssignment;
      });
      var addCourseAndAssignment = student.update({
        $push: {
          courseTaking: course._id,
          assignments: {
            $each: cookedAssignments
          }
        }
      });
      var addStudent = course.update({
        $push: { attendee: student._id }
      });
      return Promise.all([addCourseAndAssignment, addStudent]);
    }).then(function() {
      return res.json({code: 0});
    }).catch(function(err) {
      next(err);
    });
});

app.delete('/teacher/course/student', auth("Teacher"), function(req, res, next) {
  debug(req.body);
  var getStudent = Student.findById(req.body.student);
  var getCourse = Course.findById(req.body.course);
  debug('Query built, ready to exec');
  return Promise.all([getStudent, getCourse])
    .then(function(result) {
      debug('Query exec first step SUCCEED');
      var student = result[0];
      var course = result[1];
      var cookedAssignments = course.assignments.map(function(assignment) {
        var cookedAssignment = {};
        cookedAssignment.reference = assignment;
        return cookedAssignment;
      });
      var delCourseAndAssignment = student.update({
        $pop: {
          courseTaking: course._id,
          assignments: {
            $each: cookedAssignments
          }
        }
      });
      var delStudent = course.update({
        $pop: { attendee: student._id }
      });
      return Promise.all([delCourseAndAssignment, delStudent]);
    }).then(function() {
      return res.json({code: 0});
    }).catch(function(err) {
      next(err);
    });
});

module.exports = app;