/**
 * Created by MForever78 on 15/4/27.
 */

var routes = require('node-require-directory')(__dirname);

module.exports = function(app) {
  Object.keys(routes).forEach(function(key) {
    if (key === 'index') return;
    app.use('/' + key, routes[key]);
  });

  // error handling
  app.use(function(req, res, next) {
    // nothing found
    res.json({ code: Message.notFound });
  });

  app.use(function(err, req, res, next) {
    // error
    res.json({ code: Message.internalServerError });
  });
};

