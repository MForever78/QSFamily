/**
 * Created by MForever78 on 15/4/27.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var port = process.env.PORT || 3000;

/* initialize body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* jwt control */
var Jwt = require('express-jwt');

var jwtMiddleWare = Jwt({
  secret: config.get('jwtSecret'),
  credentialsRequired: false,
  getToken: function(req) {
    if (!req.body && !req.query.token) return null;
    return req.body.token || req.query.token;
  }
});

app.use(jwtMiddleWare);

/* Parse token */
var tokenParser = require("./middleware/token-parser");
app.use(tokenParser);

/* Allow CORS */
var cors = require('cors');
app.use(cors());

/* routing */
require('./routes')(app);

/* connect database */
require('./models');

/* listening */
app.listen(port, function() {
  console.log("Server listening on port: " + port + "...");
});