var StripeController = require('./../controllers/StripeController.js');

module.exports = function(app) {
  // See auth-routes for POST to /api/users 

  //app.get('/api/stripe',  SessionController.getSessions);
  app.post('/api/stripe', StripeController.chargeCard);
};