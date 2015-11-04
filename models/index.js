/**
 * Created by MForever78 on 15/4/27.
 */

var models = require('node-require-directory')(__dirname);
var config = require('config');

Object.keys(models).forEach(function(key) {
  if (key === 'index') return;
  var modelName = capitaliseFirstLetter(key);
  global[modelName] = models[key];
});

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
