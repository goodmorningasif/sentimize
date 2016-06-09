var Text = require('./../models/TextModel.js');
var watson = require('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username: process.env.BM_USER,
  password: process.env.BM_PASSWORD,
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
        if(tone.document_tone.tone_categories === undefined) {
          console.log('tone.document_tone: ', tone.document_tone);
          res.status(400).send('createText failed to produce usable data.');
        }
        console.log('Feelings: ', tone.document_tone.tone_categories[0].tones);
        console.log('Speech style: ', tone.document_tone.tone_categories[1].tones);
        console.log('Emotions: ', tone.document_tone.tone_categories[2].tones);
        var textObj = {
          anger: tone.document_tone.tone_categories[0].tones[0].score*100,
          disgust: tone.document_tone.tone_categories[0].tones[1].score*100,
          fear: tone.document_tone.tone_categories[0].tones[2].score*100,
          happiness: tone.document_tone.tone_categories[0].tones[3].score*100,
          sadness: tone.document_tone.tone_categories[0].tones[4].score*100,
          analytical: tone.document_tone.tone_categories[1].tones[0].score*100,
          confident: tone.document_tone.tone_categories[1].tones[1].score*100,
          tentative: tone.document_tone.tone_categories[1].tones[2].score*100,
    			openness: tone.document_tone.tone_categories[2].tones[0].score*100,
    			conscientiousness: tone.document_tone.tone_categories[2].tones[1].score*100,
    			extraversion: tone.document_tone.tone_categories[2].tones[2].score*100,  
    			agreeableness: tone.document_tone.tone_categories[2].tones[3].score*100, 
    			emotionalRange: tone.document_tone.tone_categories[2].tones[4].score*100, 	      
          userId: req.user.id, 
          sessionId: req.body.sessionId 
        }
        console.log('textObj', textObj);

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
