/**
 * Created by MForever78 on 15/4/27.
 */

var routes = require('node-require-directory')(__dirname);

module.exports = function(app) {
  app.use('/$', function(req, res, next) {
    res.render('index');
  });

  Object.keys(routes).forEach(function(key) {
    if (key === 'index') return;
    app.use('/' + key, routes[key]);
  });

  // error handling
  app.use(function(req, res, next) {
    // nothing found
    res.sendStatus(404);
  });

  app.use(function(err, req, res, next) {
    // error
    console.log(err.stack);
    res.sendStatus(500);
  });
};

