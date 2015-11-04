/**
 * Created by MForever78 on 15/10/28.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:assignment');
var auth = require('../middleware/auth');
var mkdirp = require('mkdirp');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    var dest = __dirname + '/../../upload/assignments/' + req.body.assignment;
    mkdirp.sync(dest);
    callback(null, dest);
  },
  filename: function(req, file, callback) {
    Student.findById(req.session.user._id)
      .then(function(student) {
        var ext = file.originalname.split('.').pop();
        var filename = [student.studentId, student.name, req.body.title].join('_');
        filename += '.' + ext;
        callback(null, filename);
      });
  }
});
var upload = multer({ storage: storage });

app.post('/', function(req, res, next) {
  var outer = {};
  return Assignment.create({
    title: req.body.title,
    course: req.body.course,
    description: req.body.description,
    dueDate: new Date(req.body.dueDate),
    deadline: new Date(req.body.deadline)
  }).then(function(assignment) {
    // add the new assignment to course
    outer.assignment = assignment;
    return Course.findByIdAndUpdate(req.body.course, {
      $push: { assignments: assignment._id }
    });
  }).then(function() {
    debug("Add assignment to course model SUCCEED");
    // add the new assignment to corresponding students
    return Student.update({
      courseTaking: req.body.course
    }, {
      $push: {
        assignments: {
          reference: outer.assignment._id
        }
      }
    }, {
      multi: true
    });
  }).then(function() {
    debug("Add assignment to student model SUCCEED");
    return res.json({ code: 0 });
  });
});

app.delete('/', function(req, res, next) {
  // delete assignment from Student, Course and finally Assignment
  var outer = {};
  return Assignment.findById(req.body.id)
    .then(function(assignment) {
      outer.assignment = assignment;
      return Course.findById(assignment.course);
    }).then(function(course) {
      outer.course = course;
      // delete from students
      var delFromStudent = Student.update({ _id: { $in: course.attendee }}, {
        $pull: {
          assignments: { reference: req.body.id }
        }
      });
      var delFromCourse = course.update({ $pull: { assignments: req.body.id }});
      var delAssignment = outer.assignment.remove();
      return Promise.all([delFromStudent, delFromCourse, delAssignment]);
    }).then(function() {
      return res.json({ code: 0 });
    });
});

app.post('/upload', auth("Student"), upload.single('file'), function(req, res, next) {
  debug("Uploaded assignment:");
  debug(req.body);
  return Student.findById(req.session.user._id)
    .then(function(student) {
      student.assignments = student.assignments.map(function(assignment) {
        if (assignment._id == req.body.assignment) {
          assignment.complete = true;
          assignment.attachmentUrl = req.file.filename;
        }
        return assignment;
      });
      return student.save();
    }).then(function() {
      return res.json({code: 0});
    }).catch(function(err) {
      Logger.error("Upload assignment error");
      Logger.error("User", req.session.user.username, "upload assignment", assignment._id);
      Logger.error(err.stack);
      return res.json({
        code: 1,
        message: "上传错误"
      });
    });
});

module.exports = app;
