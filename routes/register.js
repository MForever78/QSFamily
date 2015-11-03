/**
 * Created by MForever78 on 15/10/24.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:register');
var crypto = require('crypto');
var saltPos = require('config').get('saltPos');
var auth = require('../middleware/auth');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var XLSX = require('xlsx');

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
    default: return res.json({code: -1, message: "Invalid user role"});
  }
});

app.post('/', function(req, res, next) {
  var salt = crypto.randomBytes(64).toString('base64');
  debug("New student:");
  debug("Username:", req.body.username);
  var outer = {};
  return Register.findOne({
    $and: [
      {studentId: req.body.studentId},
      {name: req.body.name}
    ]
  }).then(function(student) {
    if (!student) {
      return res.render('register', { error: true });
    }
    var user = {
      username: req.body.username,
      salt: salt,
      password: cookPassword(req.body.password, salt),
      studentId: student.studentId,
      name: student.name,
      gender: student.gender,
      department: student.department
    };
    outer.student = student;
    return Student.create(user);
  }).then(function() {
    return outer.student.remove();
  }).then(function() {
    return res.render('login', {
      message: {
        type: 'success',
        message: '注册成功, 请登陆'
      }
    });
  });
});

app.post('/sheet', auth("Teacher"), upload.single('file'), function(req, res, next) {
  debug(req.file.buffer);
  var workbook = XLSX.read(req.file.buffer);
  // get the first work sheet
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // !ref example: A1:P42, we only want the 42 as a number
  var range = worksheet['!ref'].split(':')[1].replace(/\D/g, "");
  range = Number(range);
  var students = [];
  for (var row = 5; row <= range; row++) {
    var student = {};
    student.studentId = worksheet['B' + row].v;
    // filter the strange "'" character
    student.name = worksheet['D' + row].v.replace("'", '');
    student.gender = worksheet['E' + row].v;
    student.department = worksheet['F' + row].v;
    student.course = req.body.course;
    students.push(student);
  }
  debug(students);
  return Register.create(students).then(function() {
    return res.json({ code: 0 });
  });
});

module.exports = app;
