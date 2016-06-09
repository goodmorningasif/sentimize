var db = require('../config/db');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
require('./SnapshotModel.js');
require('./SessionModel.js');
require('./TextModel.js');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  snapshots: function() {
    return this.hasMany('Snapshot');
  },
  text: function() {
    return this.hasMany('Text');
  },
  sessions: function() {
    return this.hasMany('Session');
  },

  initialize: function() {
    this.on('creating', this.hashPassword);
  },

  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },

  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }

});

module.exports = db.model('User', User);