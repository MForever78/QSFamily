var debug = require('debug')('QSFamily:courseModel');

exports.getCourseList = function() {
  return Knex('course');
};

exports.createCourse = function(data) {
  return Knex('course')
    .insert(data);
};

exports.getCourseModules = function(courseId) {
  return Knex('course_module')
    .where('course_id', courseId);
};

exports.getCourseModulesById = function(id) {
  return Knex('course_module')
    .where('id', id);
};

exports.createCourseModule = function(data) {
  return Knex('course_module')
    .insert(data);
};

exports.updateCourseModule = function(id, data) {
  return Knex('course_module')
    .where('id', id)
    .update(data);
};

exports.deleteCourseModule = function(id) {
  return Knex('course_module')
    .where('id', id)
    .del();
};

