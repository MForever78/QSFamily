/**
 * Created by MForever78 on 15/10/24.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:write');

app.get('/', function(req, res, next) {
  if (!req.session.user || !req.session.user.role === 'Teacher') return res.redirect('/');
  res.render('write', {
    session: req.session,
    action: '/write',
    method: 'post'
  });
});

module.exports = app;
