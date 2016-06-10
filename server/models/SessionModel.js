var db = require('../config/db');
require('./SnapshotModel.js');
require('./UserModel.js');
require('./TextModel.js');

var Session = db.Model.extend({
  tableName: 'sessions',
  hasTimestamps: true,
  user: function() {
    return this.belongTo('User', 'userId');
  },
  snapshots: function() {
    return this.hasMany('Snapshot', 'sessionId');
  },
  text: function() {
    return this.hasOne('Text');
  }  
});

module.exports = db.model('Session', Session);