/**
 * Created by MForever78 on 15/4/27.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var port = process.env.PORT || 3000;

/* session control */
var Session = require('express-session');
var redis = require('redis');
var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(Session);
var sessionConf = config.get('session');

var sessionMiddleware = new Session({
  store: new RedisStore({ client: redisClient }),
  name: sessionConf.name,
  secret: sessionConf.secret,
  resave: false,
  saveUninitialized: false
});

app.use(sessionMiddleware);

/* initialize body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* serve static file on development mode */
if (app.get('env') === 'development') {
  app.use(express.static(__dirname + '/public'));
}

/* routing */
require('./routes')(app);

/* connect database */
require('./models');

/* listening */
app.listen(port, function() {
  console.log("Server listening on port: " + port + "...");
});