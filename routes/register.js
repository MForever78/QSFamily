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
var mailConfig = require('config').get('mail');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport(mailConfig.smtpConfig);

app.get('/', function(req, res, next) {
  res.render('register');
});

function cookPassword(key, salt) {
  var hash = crypto.createHash('sha512');
  return hash.update(key.slice(0, saltPos))
    .update(salt)
    .update(key.slice(saltPos))
    .digest('base64');
}

var checkUsernameReg = /^[A-Za-z0-9_\u4e00-\u9fa5]{6,20}$/;
var checkPasswordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

app.post('/', function(req, res, next) {
  var salt = crypto.randomBytes(64).toString('base64');
  debug("New student:");
  debug("Username:", req.body.username);
  var outer = {};
  // Find student form register
  return Register.findOne({
    $and: [
      {studentId: req.body.studentId},
      {name: req.body.name}
    ]
  }).then(function(student) {
    if (!student) {
      throw new Error('请输入正确的学号和姓名');
    }
    if (!checkUsernameReg.test(req.body.username) || !checkPasswordReg.test(req.body.password)) {
      throw new Error('用户名只能包含数字、字母、汉字和下划线，至少 6 位。密码必须包含一个字母和一个数字，至少 8 位');
    }
    var user = {
      username: req.body.username,
      salt: salt,
      password: cookPassword(req.body.password, salt),
      studentId: student.studentId,
      name: student.name,
      gender: student.gender,
      department: student.department,
      courseTaking: student.course
    };
    outer.student = student;
    // create user and query course
    var addStudent =  Student.create(user);
    var queryCourse = Course.findById(student.course);
    return Promise.all([addStudent, queryCourse]);
  }).then(function(result) {
    if (!result[0]) {
      throw new Error('用户名已经被使用');
    }
    var student = result[0];
    var course = result[1];
    var cookedAssignments = course.assignments.map(function(assignment) {
      var cookedAssignment = {};
      cookedAssignment.reference = assignment;
      return cookedAssignment;
    });
    // add student to course attendee
    var addToCourse = course.update({
      $push: {
        attendee: student._id
      }
    });
    // add assignments to student
    var addToStudent = student.update({
      $push: {
        assignments: { $each: cookedAssignments }
      }
    });
    return Promise.all([addToCourse, addToStudent]);
  }).then(function() {
    // remove student from register
    return outer.student.remove();
  }).then(function() {
    return res.render('login', {
      message: {
        type: 'success',
        text: '注册成功, 请登陆'
      }
    });
  }).catch(function(err) {
    return res.render('register', {
      message: {
        type: 'error',
        text: err.message
      }
    });
  });
});

app.post('/reset', auth("Teacher"), function(req, res, next) {
  return User.findById(req.body.id)
    .then(function(user) {
      if (!user) throw new Error("Cannot find user for id:", req.body.id);
      user.password = cookPassword(req.body.password, user.salt);
      return user.save();
    }).then(function() {
      return res.json({code: 0});
    });
});

app.post('/grant', auth("Teacher"), function(req, res, next) {
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
  return Register.create(students).then(function(newStudents) {
    // query all the "new" students who have already in the database
    newStudentsId = newStudents.map(function(newStudent) {
      return newStudent.studentId;
    });
    var findOldStudents = Student.find({
      studentId: {
        $in: newStudentsId
      }
    });
    var findCourse = Course.findById(req.body.course);
    return Promise.all([findOldStudents, findCourse]);
  }).then(function(result) {
    var oldStudents = result[0];
    var course = result[1];
    // delete all the old students from registry
    // and add them into course
    var oldStudentsSid = oldStudents.map(function(oldStudent) {
      return oldStudent.studentId;
    });

    var oldStudentsId = oldStudents.map(function(oldStudent) {
      return oldStudent._id;
    });

    var cookedAssignments = course.assignments.map(function(assignment) {
      var cookedAssignment = {};
      cookedAssignment.reference = assignment;
      return cookedAssignment;
    });
    // add students to course attendee
    var addToCourse = course.update({
      $push: {
        attendee: { $each: oldStudentsId }
      }
    });
    // add assignments and course to student
    var addToStudents = Student.update({
      _id: {
        $in: oldStudentsId
      }
    }, {
      $push: {
        assignments: { $each: cookedAssignments },
        courseTaking: course._id
      }
    }, {
      multi: true
    });
    // remove students from registry
    var removeOldStudents = Register.remove({
      studentId: {
        $in: oldStudentsSid
      }
    });

    return Promise.all([addToCourse, addToStudents, removeOldStudents]);
  }).then(function(result) {
    debug(result);
    return res.json({ code: 0 });
  }).catch(function(err) {
    res.render('register', {
      session: req.session,
      message: {
        type: 'error',
        text: err.message
      }
    });
  });
});

app.post('/findpassword', function(req, res, next) {
  var outer = {};
  Student.findOne({
    $and: [
      {studentId: req.body.studentId},
      {name: req.body.name},
      {username: req.body.username}
    ]
  }).then(function(student) {
    if (!student) {
      throw new Error('请输入正确的学号、姓名及注册时输入的用户名');
    }
    var password = crypto.randomBytes(12).toString('base64');
    outer.password = password;
    return student.update({
      $set: {
        password: cookPassword(password, student.salt)
      }
    });
  }).then(function() {
    return transporter.sendMail({
      from: mailConfig.from,
      to: req.body.studentId + "@zju.edu.cn",
      subject: "轻松家园密码找回",
      text: "你的新密码是：" + outer.password + "\n请在登入后尽快修改密码"
    });
  }).then(function() {
    next();
    return res.render('login', {
      message: {
        type: 'success',
        text: '你的密码已经被重置，新密码已发至你的学号邮箱中，请查收'
      }
    });
  }).catch(function(err) {
    next(err);
    return res.render('login', {
      message: {
        type: 'error',
        text: err.message
      }
    });
  });
}, function(req, res, next) {
  log(req.body.name + "重置了密码", 'warn');
}, function(err, req, res, next) {
  log(req.body.name + "重置密码时发生了错误", 'error');
});

module.exports = app;
