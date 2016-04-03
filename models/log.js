/**
 * Created by MForever78 on 16/4/3.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
    message: String,
    level: String,

    createAt: {
        type: Date,
        "default": new Date()
    },
});

var Log = mongoose.model('Log', logSchema);
module.exports = Log;
