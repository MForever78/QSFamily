/**
 * Created by MForever78 on 15/10/24.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:register');
var crypto = require('crypto');
var saltPos = require('config').get('saltPos');

function cookPassword(key, salt) {
  var hash = crypto.createHash('sha512');
  return hash.update(key.slice(0, saltPos))
    .update(salt)
    .update(key.slice(saltPos))
    .digest('base64');
}

app.post('/', function(req, res, next) {
  var salt = crypto.randomBytes(64).toString('base64');
  debug("New user:");
  debug("Username:", req.body.username);
  debug("Role:", req.body.role);
  var user = {
    username: req.body.username,
    salt: salt,
    password: cookPassword(req.body.password, salt),
    name: req.body.name
  };
  switch(req.body.role) {
    case "Teacher":
      return Teacher.create(user)
        .then(function(teacher) {
          debug('Created teacher:', teacher.username);
          return res.json({code: 0});
        });
    case "Assistant":
      return Assistant.create(user)
        .then(function(assistant) {
          debug('Create assistant:', assistant.username);
          return res.json({code: 0});
        });
    case "Student":
      user.studentId = req.body.studentId;
      return Student.create(user)
        .then(function(student) {
          debug('Create student:', student.username);
          return res.json({code: 0});
        }).onReject(function(err) {
          next(err);
        });
    default: return res.json({code: -1, message: "Invalid user role"});
  }
});

module.exports = app;
