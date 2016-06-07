var Text = require('./../models/TextModel.js');

module.exports = {
  createText: function(req, res) {
    var data = req.body.textData;

    if (data.tone_catagories === undefined) {
      res.send(400).send('Text failed to produce usable data.');
    }
    
    var textObj = {
      sadness: data.tone_catagories[0].tones[0].score,
      anger: data.tone_catagories[0].tones[1].score,
      surprise: data.tone_catagories[0].tones[2].score,
      fear: data.tone_catagories[0].tones[3].score,
      happiness: data.tone_catagories[0].tones[4].score,
      disgust: data.tone_catagories[0].tones[5].score,
      analytical: data.tone_catagories[1].tones[0].score,
      confident: data.tone_catagories[1].tones[1].score,
      tentative: data.tone_catagories[1].tones[2].score,
			openness: data.tone_catagories[2].tones[0].score,
			conscientiousness: data.tone_catagories[2].tones[1].score,
			extraversion: data.tone_catagories[2].tones[2].score,  
			agreeableness: data.tone_catagories[2].tones[3].score, 
			emotionalRange: data.tone_catagories[2].tones[4].score, 	      
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
