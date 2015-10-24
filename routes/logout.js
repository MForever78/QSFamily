/**
 * Created by MForever78 on 15/10/24.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:logout');

app.get('/', function(req, res, next) {
  req.session = null;
  return res.redirect('/');
});

module.exports = app;