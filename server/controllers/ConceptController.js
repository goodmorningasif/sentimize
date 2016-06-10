var Concept = require('../models/ConceptModel.js');
var watson = require('watson-developer-cloud');

var dummyText = " Why would politicians want to change a system that's totally rigged in order to keep them in power? That's what they're doing, folks. Why would politicians want to change a system that's made them and their friends very, very wealthy? I beat a rigged system, by winning with overwhelming support. The only way you could have done it. Landslides all over the country, with every demographic on track to win 37 primary caucus victories in a field that began with 17 very talented people. After years of disappointment, there's one thing we all have learned. We can't fix the rigged system by relying on — and I mean this so, so strongly — the very people who rigged it. And they rigged it. And do not ever think anything differently. We can't solve our problems by counting on the politicians who created our problems. The Clintons have turned the politics of personal enrichment into an art form for themselves. They've made hundreds of millions of dollars selling access, selling favors, selling government contracts, and I mean hundreds of millions of dollars. Secretary Clinton even did all of the work on a totally illegal private server. Something that how she's getting away with nobody understands. Designed to keep her corrupt dealings out of the public record, putting the security of the entire country at risk, and a president in a corrupt system is totally protecting her. Not right."


var concept_insights = watson.concept_insights({
  username: process.env.CONCEPT_USERNAME,
  password: process.env.CONCEPT_PASSWORD,
  version: 'v2'
});

module.exports = {
	createConcept: function(req, res) {

		var data = req.body.conceptData;
		console.log('req.body', req.body);
		
		var params = {
		  graph: '/graphs/wikipedia/en-latest',
		  text: dummyText
		}
		concept_insights.graphs.annotateText(params, function(err, concept) {
		  if (err)
		    console.log('concept err: ', err);
		    console.log('concept: ', concept.annotations);
		    // input into mode here


		    for ( var i = 0; i < concept.annotations.length; i++ ) {
		    	var conceptObj = {
			    	concept: JSON.stringify(concept.annotations[i].concept),
			    	score: concept.annotations[i].concept.score,
			    	text_index:  JSON.stringify(concept.annotations[i]['text_index']),
	          userId: req.user.id, 
	          sessionId: req.body.sessionId 
		    	}
			    console.log('conceptObj ', conceptObj);

	        new Concept(conceptObj).save()
	        .then(function(newConcept) {
	          res.status(201).send();
	        })
	        .catch(function(err) {
	          console.error(err);
	        });
			  }
		});
	},
	getConcepts: function(req, res) {
		var queryObj = {
			sessionId: req.param('sessionId')
		}

		Concept.where(queryObj).fetchAll()
		  .then(function(concept) {
		  	res.status(200).send(concept);
		  })
		  .catch(function(err) {
		  	console.error(err);
		  });
	}

}

