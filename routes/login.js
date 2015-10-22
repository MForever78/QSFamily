/**
 * Created by MForever78 on 15/10/22.
 */

var app = require('express')();

app.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = app;