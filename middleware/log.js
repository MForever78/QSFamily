var debug = require('debug')('QSFamily:middleware:log');

var log = function(message, level) {
    var _level = level || "info";
    Log.create({
        message: message,
        level: _level
    }).then(function() {
        debug("logged to database");
    });
}

module.exports = log;
