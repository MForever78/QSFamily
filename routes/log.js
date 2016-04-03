/**
 * Created by MForever78 on 16/4/3.
 */

var app = require('express')();
var debug = require('debug')('QSFamily:route:log');
var auth = require('../middleware/auth');

app.get('/', auth('Teacher'), function(req, res, next) {
    Log.find().then(function(logs) {
        res.render('log', {
            session: req.session,
            logs: logs
        });
    });
});

module.exports = app;
