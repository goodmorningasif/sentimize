var Text = require('./../models/TextModel.js');
var watson = require('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: '0901bd8d-574f-49c5-9897-e2827231e70d',
  password: 'lajb4FTYDp3I',
  version: 'v3',
  version_date: '2016-05-19'
});


module.exports = {
  createText: function(req, res) {

    var data = req.body.textData;
    console.log('req.body', req.body);

    tone_analyzer.tone({ text: req.body.textData }, function(err, tone) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(JSON.stringify(tone, null, 2));
        if (tone.document_tone.tone_catagories === undefined) {
          res.send(400).send('Text failed to produce usable data.');
        }

        var textObj = {
          sadness: tone.document_tone.tone_catagories[0].tones[0].score,
          anger: tone.document_tone.tone_catagories[0].tones[1].score,
          surprise: tone.document_tone.tone_catagories[0].tones[2].score,
          fear: tone.document_tone.tone_catagories[0].tones[3].score,
          happiness: tone.document_tone.tone_catagories[0].tones[4].score,
          disgust: tone.document_tone.tone_catagories[0].tones[5].score,
          analytical: tone.document_tone.tone_catagories[1].tones[0].score,
          confident: tone.document_tone.tone_catagories[1].tones[1].score,
          tentative: tone.document_tone.tone_catagories[1].tones[2].score,
    			openness: tone.document_tone.tone_catagories[2].tones[0].score,
    			conscientiousness: tone.document_tone.tone_catagories[2].tones[1].score,
    			extraversion: tone.document_tone.tone_catagories[2].tones[2].score,  
    			agreeableness: tone.document_tone.tone_catagories[2].tones[3].score, 
    			emotionalRange: tone.document_tone.tone_catagories[2].tones[4].score, 	      
          userId: req.user.id, 
          sessionId: req.body.sessionId 
        }

        return new Text(textObj).save()
        .then(function(newText) {
          res.status(201).send(newText);
        })
        .catch(function(err) {
          console.error(err);
        });
      }
    });
  },

  getTexts: function(req, res) {
    var queryObj = {
      sessionId: req.param('sessionId')
    }

    Text.where(queryObj).fetchAll()
      .then(function(text) {
        res.status(200).send(text);
      })
      .catch(function(err) {
        console.error(err);
      });
  }
}
