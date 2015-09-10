var debug = require('debug')('QSFamily:courseModel');

exports.getCourseList = function() {
  return Knex('course');
};

exports.getCourseById = function(courseId) {
  return Knex('course')
    .where("id", courseId);
};

exports.updateCourse = function(courseId, data) {
  return Knex('course')
    .where('id', courseId)
    .update(data);
};

exports.deleteCourse = function(id) {
  return Knex('course')
    .where('id', id)
    .del();
};

exports.createCourse = function(data) {
  return Knex('course')
    .insert(data);
};
