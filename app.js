/**
 * Created by MForever78 on 15/4/27.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var port = process.env.PORT || 3000;

/* jwt control */
var Jwt = require('express-jwt');

var jwtMiddleWare = Jwt({
  secret: config.get('jwtSecret'),
  credentialsRequired: false
});

app.use(jwtMiddleWare);

/* initialize body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* routing */
require('./routes')(app);

/* connect database */
require('./models');

/* listening */
app.listen(port, function() {
  console.log("Server listening on port: " + port + "...");
});