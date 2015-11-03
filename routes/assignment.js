/**
 * Created by MForever78 on 15/10/28.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:assignment');
var auth = require('../middleware/auth');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: __dirname + '/../../upload/assignments',
  filename: function(req, file, callback) {
    Student.findById(req.session.user._id)
      .then(function(student) {
        var ext = file.originalname.split('.').pop();
        var filename = [student.studentId, student.name, req.body.title].join('_');
        filename += '.' + ext;
        callback(null, filename);
      })
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
  return Assignment.findByIdAndRemove(req.body.id)
    .then(function() {
      return res.json({ code: 0 });
    }).catch(function(err) {
      next(err);
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
        }
        return assignment;
      });
      return student.save();
    }).then(function() {
      return res.json({code: 0});
    });
});

module.exports = app;
