/**
 * Created by MForever78 on 15/4/27.
 */

var routes = require('node-require-directory')(__dirname);

module.exports = function(app) {
  Object.keys(routes).forEach(function(key) {
    if (key === 'index') return;
    app.use('/' + key, routes[key]);
  });
};

