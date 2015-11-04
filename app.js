/**
 * Created by MForever78 on 15/4/27.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var morgan = require('morgan');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');

/* Connect database */
mongoose.connect('mongodb://localhost/qsfamily', {
  user: config.get('db.username'),
  pass: config.get('db.password')
});

/* serve static files */
app.use(express.static('public'));

/* initialize body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* set view engine */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/* logger */
app.use(morgan('dev'));

/* session */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: config.get('sessionSecret'),
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

/* routing */
require('./routes')(app);

/* connect database */
require('./models');

/* listening */
app.listen(port, function() {
  console.log("Server listening on port: " + port + "...");
});
