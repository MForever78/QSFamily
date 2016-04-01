/**
 * Created by MForever78 on 15/10/28.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:assignment');
var auth = require('../middleware/auth');
var mkdirp = require('mkdirp');
var multer = require('multer');
var fs = require('fs');

var uploadDest = __dirname + '/../../upload/assignments/';

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    var dest = uploadDest + req.body.assignment;
    mkdirp.sync(dest);
    callback(null, dest);
  },
  filename: function(req, file, callback) {
    Student.findById(req.session.user._id)
      .then(function(student) {
        var ext = file.originalname.split('.').pop();
        var filename = [student.studentId, student.name, req.body.title].join('_');
        filename += '.' + ext;
        callback(null, filename);
      });
  }
});
var upload = multer({ storage: storage });

app.post('/', function(req, res, next) {
  // Logger middleware
  Logger.info("Adding assignment:", req.body);
  next();
}, function(req, res, next) {
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
  }).catch(function(err) {
    next(err);
    return res.json({
      code: -1,
      message: "添加作业失败"
    });
  });
}, function(err, req, res, next) {
  // error logger
  if (err) {
    Logger.error("Add assignment error");
    Logger.error("User", req.session.user.username, "add assignment", req.body.title);
    Logger.error(err.stack); 
  }
});

app.delete('/', function(req, res, next) {
  // delete assignment from Student, Course and finally Assignment
  var outer = {};
  return Assignment.findById(req.body.id)
    .then(function(assignment) {
      outer.assignment = assignment;
      return Course.findById(assignment.course);
    }).then(function(course) {
      outer.course = course;
      // delete from students
      var delFromStudent = Student.update({ _id: { $in: course.attendee }}, {
        $pull: {
          assignments: { reference: req.body.id }
        }
      }, {
        multi: true
      });
      var delFromCourse = course.update({ $pull: { assignments: req.body.id }});
      var delAssignment = outer.assignment.remove();
      return Promise.all([delFromStudent, delFromCourse, delAssignment]);
    }).then(function() {
      return res.json({ code: 0 });
    }).catch(function(err) {
      next(err);
      return res.json({
        code: -1,
        message: "删除作业失败"
      });
    });
}, function(err, req, res, next) {
  if (err) {
    Logger.error("Delete assignment error");
    Logger.error("User", req.session.user.username, "delete assignment", req.body.id);
    Logger.error(err.stack);
  }
});

app.post('/upload', auth("Student"), upload.single('file'), function(req, res, next) {
  Logger.info("Uploaded assignment:", req.body);
  next();
}, function(req, res, next) {
  return Student.findById(req.session.user._id)
    .populate('assignments.reference')
    .then(function(student) {
      student.assignments = student.assignments.map(function(assignment) {
        if (assignment.reference && assignment.reference._id == req.body.assignment) {
          // if has passed the due date, then refuse it
          var now = new Date();
          if (now > assignment.reference.deadline) {
            throw new Error("Deadline passed, yet user want to upload assignment!");
          }
          if (now > assignment.reference.dueDate) {
            assignment.late = true;
          }
          if (!assignment.complete) {
            // first time upload assignment, just accept it
            assignment.complete = true;
            assignment.attachmentUrl = req.file.filename;
          } else {
            // not first time, remove the original one first
            // usage of sync maybe slow
            fs.unlinkSync(uploadDest + assignment.reference._id + '/' + assignment.attachmentUrl);
            // update attachmentUrl
            assignment.attachmentUrl = req.file.filename;
          }
        }
        return assignment;
      });
      return student.save();
    }).then(function() {
      return res.json({code: 0});
    }).catch(function(err) {
      next(err);
      return res.json({
        code: 1,
        message: "上传错误"
      });
    });
}, function(err, req, res, next) {
  if (err) {
    Logger.error("Upload assignment error");
    Logger.error("User", req.session.user.username, "upload assignment", req.body.assignment);
    Logger.error(err.stack);
  }
});

app.get('/download/:assignmentid', function(req, res, next) {
  if (!req.session.user) return res.redirect('/');
  Student.findById(req.session.user._id)
    .populate('assignments.reference')
    .then(function(student) {
      var assignment = student.assignments.find(function(assignment) {
        return assignment._id == req.params.assignmentid;
      });
      if (assignment) {
        return res.download(uploadDest + assignment.reference._id + '/' + assignment.attachmentUrl, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Download succeed");
          }
        });
      }
    });
});

module.exports = app;

