/**
 * Created by MForever78 on 15/10/28.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:assignment');

app.post('/', function(req, res, next) {
  return Assignment.create({
    title: req.body.title,
    course: req.body.courseId,
    description: req.body.description,
    dueDate: new Date(req.body.dueDate),
    deadline: new Date(req.body.deadline)
  }).then(function(assignment) {
    // TODO: add new assignment to course and corresponding student
    return res.json({code: 0});
  });
});

module.exports = app;
