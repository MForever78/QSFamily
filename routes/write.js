/**
 * Created by MForever78 on 15/10/24.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:write');
var auth = require('../middleware/auth');

app.get('/', auth('Teacher'), function(req, res, next) {
  res.render('write', {
    session: req.session,
    action: '/write',
    method: 'post'
  });
});

app.post('/', auth('Teacher'), function(req, res, next) {
  var news = {
    title: req.body.title,
    author: req.session.user._id,
    content: req.body.content
  };
  News.create(news)
    .then(function() {
      return res.json({code: 0});
    });
});

module.exports = app;
