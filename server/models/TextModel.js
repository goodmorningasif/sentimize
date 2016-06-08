var db = require('../config/db.js');
var User = require('./UserModel.js');
var Session = require('./SessionModel.js');

db.knex.schema.hasTable('text').then(function(exists){
  if(!exists) {
    db.knex.schema.createTable('text', function(text) {
      text.increments('id').primary();
      text.integer('sadness');
      text.integer('anger');
      text.integer('fear');
      text.integer('happiness');
      text.integer('disgust');
      text.integer('analytical');
      text.integer('confident');
      text.integer('tentative');
			text.integer('openness');
			text.integer('conscientiousness');
			text.integer('extraversion');  
			text.integer('agreeableness'); 
			text.integer('emotionalRange'); 		
      text.integer('userId');
      text.integer('sessionId');
      text.timestamps();
    }).then(function(){
      console.log('Text table created')
    })
  }
});

var Text = db.Model.extend({
  tableName: 'text',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User, 'userId');
  },
  session: function() {
    return this.belongsTo(Session, 'sessionId');
  },
})

module.exports = Text;