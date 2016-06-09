 // Load environment variables
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: './env/development.env' });
} else if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: './env/production.env' });
}

var express = require('express');
var passport = require('passport');
var util = require('./lib/utility.js');

var router = express.Router(),
  vcapServices = require('vcap_services'),
  extend = require('util')._extend,
  watson = require('watson-developer-cloud');


var app = express();

// Initial Configuration, Static Assets, & View Engine Configuration
require('./config/initialize.js')(app, express);
// Authentication Middleware: Express Sessions, Passport Strategy
require('./config/auth.js')(app, express, passport);

// Pre-Authentication Routes & OAuth Requests
require('./routes/auth-routes.js')(app, passport);

//Authentication check currently commented out, uncomment line to re-activate
app.use(util.ensureAuthenticated);

// View Routes
require('./routes/view-routes.js')(app);
// API Routes
require('./routes/api-routes.js')(app);

require('./routes/stripe-routes.js')(app);


var sttConfig = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: '7a7fa1e8-78a0-47cd-97d1-e8c789c1d2ff',
  password: '0oxAekIYeIPw',
}, vcapServices.getCredentials('speech_to_text'));

var sttAuthService = watson.authorization(sttConfig);

router.get('/api/speech-to-text/token', function(req, res) {
  sttAuthService.getToken({url: sttConfig.url}, function(err, token) {
    if (err) {
      console.log('Error retrieving token: ', err);
      res.status(500).send('Error retrieving token');
      return;
    }
    res.send(token);
  });
});


// Wildcard route
app.get('/*', function(req, res) {
  res.redirect('/');
})

app.listen(Number(process.env.PORT), process.env.HOST, function() {
  console.log('NODE_ENV: ' + process.env.NODE_ENV);
  console.log(process.env.APP_NAME + ' is listening at ' + process.env.HOST + ' on port ' + process.env.PORT + '.')
});