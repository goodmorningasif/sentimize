var connection = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    database: process.env.APP_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8'
  }
};

var knex = require('knex')(connection);

connection.database = process.env.APP_NAME;
var db = require('bookshelf')(knex);

db.plugin('registry');

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('email', 255).unique();
      user.string('password', 255);
      user.string('gender', 1);
      user.integer('age');
      user.string('ethnicity', 255);
      user.string('firstName', 255);
      user.string('lastName', 255);
      user.boolean('payed');
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('sessions').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('sessions', function(session) {
      session.increments('id').primary();
      session.integer('userId');
      session.string('title');
      session.string('description');
      session.string('subject');
      session.string('date');
      session.string('duration');
      session.timestamps();
    }).then(function() {
      console.log('Session Table created');
    })
  }
});

db.knex.schema.hasTable('snapshots').then(function(exists){
  if(!exists) {
    db.knex.schema.createTable('snapshots', function(snapshot) {
      snapshot.increments('id').primary();
      snapshot.integer('mood');
      snapshot.integer('gender-c');
      snapshot.string('gender-v');
      snapshot.integer('age');
      snapshot.integer('ethnicity-c');
      snapshot.string('ethnicity-v', 50);
      snapshot.integer('sadness');
      snapshot.integer('anger');
      snapshot.integer('surprise');
      snapshot.integer('fear');
      snapshot.integer('happiness');
      snapshot.integer('disgust');
      snapshot.integer('userId');
      snapshot.integer('sessionId');
      snapshot.timestamps();
    }).then(function(){
      console.log('Snapshots table created')
    })
  }
});

db.knex.schema.hasTable('text').then(function(exists){
  if(!exists) {
    db.knex.schema.createTable('text', function(text) {
      text.increments('id').primary();
      // EMOTION
      text.integer('sadness');
      text.integer('anger');
      text.integer('fear');
      text.integer('happiness');
      text.integer('disgust');

      // LANGUAGE STYLE
      text.integer('analytical');
      text.integer('confident');
      text.integer('tentative');

      // SOCIAL TENDENCY
      text.integer('openness');
      text.integer('conscientiousness');
      text.integer('extraversion');  
      text.integer('agreeableness'); 
      text.integer('emotionalRange');     

      // DB info
      text.integer('userId');
      text.integer('sessionId');
      text.timestamps();
    }).then(function(){
      console.log('Text table created')
    })
  }
});

module.exports = db;