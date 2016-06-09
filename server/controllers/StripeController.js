var User = require('./../models/UserModel.js');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var stripe = require("stripe")("sk_test_PanpveFjGob7BUFMW4zLaQ2l");

exports.chargeCard = function(req, res) {
  //console.log('THECHARGECARDBODY', req.body);
  //console.log('THE USER', req.user);
  
  var stripeToken = req.body.stripeToken;
  console.log('token:', stripeToken.card);

  var charge = stripe.charges.create({
  amount: 1000, // amount in cents, again
  currency: "usd",
  source: stripeToken,
  description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
    // The card has been declined
      console.log('CARD DECLINED');
    } else {
      //post to user that payed
      console.log('CARD PASS', charge, err);
      User.where({ email: req.user.attributes.email }).fetch().then(function(user) {
       // console.log('THE USER', user);
        //user.payed = true;
        user.save({payed: true})
      });
    }
  });

};



