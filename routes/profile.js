/**
 * Created by MForever78 on 16/3/27.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:profile');
var authenticate = require('../utils/authenticate');
var cook = require('../utils/passwordCook');
var crypto = require('crypto');

app.get('/', function(req, res, next) {
    if (!req.session.user) return res.redirect('/');
    switch(req.session.user.role) {
        case "Teacher":
            return res.render('profile', {
                session: req.session
            });
        case "Student":
            Student.findById(req.session.user._id).then(function(user) {
                return res.render('profile', {
                    session: req.session,
                    reminder: user.reminder
                });
            }).catch(function(err) {
                return res.render('profile', {
                    session: req.session,
                    message: {
                        type: 'error',
                        text: err.message
                    }
                });
            });
    }
});

app.post('/resetpassword', function(req, res, next) {
    if (!req.session.user) return res.redirect('/');
    debug("reseting password");
    debug(req.session.user._id);
    User.findById(req.session.user._id)
        .then(function(user) {
            if (authenticate(user, req.body.oldpassword)) {
                debug("validate succeed");
                if (!cook.checkPasswordReg.test(req.body.password)) {
                    throw new Error('用户名只能包含数字、字母、汉字和下划线，至少 6 位。密码必须包含一个字母和一个数字，至少 8 位');
                }
                var salt = crypto.randomBytes(64).toString('base64');
                return user.update({
                    salt: salt,
                    password: cook.cookPassword(req.body.password, salt)
                });
            }
        }).then(function() {
            req.session.destroy();
            return res.render('profile', {
                message: {
                    type: 'success',
                    text: '密码修改成功，请重新登陆'
                }
            });
        }).catch(function(err) {
            return res.render('profile', {
                session: req.session,
                message: {
                    type: 'error',
                    text: err.message
                }
            });
        });
});

app.post('/reminder', function(req, res, next) {
    if (!req.session.user) return res.redirect('/');
    debug('Changing reminder setting');
    Student.findByIdAndUpdate(req.session.user._id, {
        $set: {
            reminder: {
                dueDate: req.body.dueDate,
                deadline: req.body.deadline
            }
        }
    }).then(function(student) {
        return res.render('profile', {
            session: req.session,
            reminder: {
                dueDate: req.body.dueDate,
                deadline: req.body.deadline
            },
            message: {
                type: 'success',
                text: '作业提醒设置修改成功'
            }
        });
    });
});

module.exports = app;