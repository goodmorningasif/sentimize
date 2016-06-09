var db = require('../config/db.js');
require('./UserModel.js');
require('./SessionModel.js');

var Text = db.Model.extend({
  tableName: 'text',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo('User', 'userId');
  },
  session: function() {
    return this.belongsTo('Session', 'sessionId');
  },
})

module.exports = db.model('Text', Text);