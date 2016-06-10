var UserController = require('./../controllers/UserController.js');
var SessionController = require('./../controllers/SessionController.js');
var SnapshotController = require('./../controllers/SnapshotController.js');
var TextController = require('./../controllers/TextController.js');
var ConceptController = require('./../controllers/ConceptController.js');

module.exports = function(app) {
  // See auth-routes for POST to /api/users
  app.get('/api/users', UserController.getCurrentUser);
  app.put('/api/users', UserController.updateUser);

  app.get('/api/session',  SessionController.getSessions);
  app.post('/api/session', SessionController.createSession);
  app.post('/api/session/update', SessionController.updateSession);
  app.post('/api/session/delete', SessionController.deleteSession);

  app.get('/api/snapshot', SnapshotController.getSnapshots);
  app.post('/api/snapshot', SnapshotController.createSnapshot);

	app.get('/api/text', TextController.getTexts);
  app.post('/api/text', TextController.createText);

  app.get('/api/concept', ConceptController.getConcepts);
  app.post('/api/concept', ConceptController.createConcept);
};