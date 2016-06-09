var db = ('../config/db.js');
var Snapshot = require('../models/SnapshotModel.js');
var Session = require('../models/SessionModel.js');
var moment = require('moment');

module.exports = {
  createSession: function(req, res) {
    // Dummy data for now in: title, description, subject, and duration
    console.log(req.data, 'REQ DATA')
    console.log(req.body, 'REQ BODY')
    var sessionObj = {
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      date: moment().format('MMMM Do YYYY, h:mm a'),
      duration: 'Temporary Duration'
    }

    return new Session(sessionObj).save()
      .then(function(newSession) {
        res.status(201).send(newSession);
      })
      .catch(function(err) {
       console.log(err);
      });
  },

  getSessions: function(req, res) {
    var queryObj = {
      userId: req.user.id
    }

    Session.where(queryObj).fetchAll()
      .then(function(sessions) {
        res.status(200).send(sessions);
      })
      .catch(function(err) {
        console.error(err);
      })
  },

  updateSession: function(req, res) {
    return Session.forge({id: req.body.sessionId})
      .fetch()
      .then(function(session) {
        session.save({
          duration: req.body.difference
        })
      })
      .then(function(updatedSession) {
        res.status(201).send(updatedSession)
      })
      .catch(function(err) {
        console.log('Error in updating session', err)
      })
  },

  deleteSession: function(req, res) {
    var sessionId = req.body.sessionId;
    Session.forge({id: sessionId})
      .fetch()
      .then(function(found) {
        console.log(found.snapshots())
        res.status(200).send(found);
      })
      // .del()
      // .then(function(removedSession) {
      //   console.log('Removed session', removedSession)
      //   res.status(201).send(removedSession);
      // })
      // .catch(function(err) {
      //   console.log('Error in deleting session', err)
      // })
  }
}