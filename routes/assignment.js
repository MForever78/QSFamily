/**
 * Created by MForever78 on 15/10/28.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:assignment');

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

module.exports = app;
