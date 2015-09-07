var express = require('express');
var app = module.exports = express();
var debug = require('debug')('QSFamily:courseRoute');

app.get('/:courseId', function(req, res, next) {
  debug('Getting course', req.params.courseId);
  Course.getCourseById(req.params.courseId)
    .then(function(course) {
      debug('Found course', req.params.courseId);
      res.json({
        code: Message.ok,
        course: course[0]
      });
    });
});

app.post('/', function(req, res, next) {
  debug('Creating new course');
  Course.createCourse(req.body)
    .then(function(id) {
      debug('Created course', id);
      Course.getCourseById(id)
        .then(function(course) {
          res.json({
            code: Message.ok,
            course: course[0]
          });
        });
    });
});

app.put('/:courseId', function(req, res, next) {
  debug('Updating course', req.params.courseId);
  Course.updateCourse(req.params.courseId, req.body)
    .then(function() {
      debug('Update', req.params.coursId, "succeed");
      Course.getCourseById(req.params.courseId)
        .then(function(course) {
          res.json({
            code: Message.ok,
            course: course[0]
          });
        });
    });
});

app.delete('/:courseId', function(req, res, next) {
  debug('Deleting course', req.params.courseId);
  Course.deleteCourse(req.params.courseId)
    .then(function() {
      debug('deleted course', req.params.courseId);
      res.json({
        code: Message.ok
      });
    });
});

app.get('/', function(req, res, next) {
  debug('Getting course list');
  Course.getCourseList()
    .then(function(courseList) {
      res.json({
        code: Message.ok,
        courseList: courseList
      });
    }).catch(function(err) {
      err.message = "Get course list error";
      next(err);
    });
});

