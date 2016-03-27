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
    return res.render('profile', {
        session: req.session
    });
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

module.exports = app;