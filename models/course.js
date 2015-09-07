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
    .update({
      course_name: data.course_name,
      description: data.description
    });
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

