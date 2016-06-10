var db = require('../config/db.js');
require('./SessionModel.js');
require('./UserModel.js');


var Snapshot = db.Model.extend({
  tableName: 'snapshots',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo('User', 'userId');
  },
  session: function() {
    return this.belongsTo('Session', 'sessionId');
  },
})

module.exports = db.model('Snapshot', Snapshot);