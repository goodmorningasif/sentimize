var db = require('../config/db.js');
var User = require('./UserModel.js');
var Session = require('./SessionModel.js');

db.knex.schema.hasTable('concept').then(function(exists){
  if(!exists) {
    db.knex.schema.createTable('concept', function(concept) {
      concept.increments('id').primary();
      // Concept Insights 1
      concept.string('concept');
      concept.integer('score');
      concept.string('text_index');     

      // DB info
      concept.integer('userId');
      concept.integer('sessionId');
      concept.timestamps();
    }).then(function(){
      console.log('Concept table created')
    })
  }
});

var Concept = db.Model.extend({
  tableName: 'concept',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User, 'userId');
  },
  session: function() {
    return this.belongsTo(Session, 'sessionId');
  },
})

module.exports = Concept;