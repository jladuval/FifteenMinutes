var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

exports.GetHome = function(req, res){
    transaction.Add(function(){
        getRandomStory(function(err, data){
            if(data === null){                
				renderHome(res, null, null, null);
            }
            else{
				var sentences = data.sentences;
				if(sentences && sentences.length > 2 ){
					sentences = sentences.splice(sentences.length - 2, sentences.length);
				}
                renderHome(res, data._id, sentences, data.title);
            }
        }, req.connection.remoteAddress);        
    });
    transaction.Commit();
};

exports.PostHome = function(req, res){
    var id = new ObjectId(req.body.objectId);
    transaction.Add(function(){
        var ip = req.connection.remoteAddress;
        models.Story.findOne()
            .where('_id').equals(id)
            .exec(function(err, story){
                if(story){
                    if(story.sentencecount === 0 && req.body.title !== null){
                        story.title = req.body.title;
                        story.sentences.push({text: req.body.sentence, ip : ip, order : story.sentencecount});
                    }
                    else{
                        story.sentences.push({text: req.body.sentence, ip : ip, order : story.sentencecount});
                    }
					story.ended = req.body.submit != "Submit";
                    story.sentencecount++;
                    story.save();
                }
                else{
					var story = new models.Story();
					story.setup();
					story.title = req.body.title;
					story.intialteller = req.connection.remoteAddress;
					story.sentences.push({text: req.body.sentence, ip : ip, order : story.sentencecount});
					story.sentencecount++;
					story.save();          
                }
				res.redirect('/Story?id=' + id);
            });
    });
    transaction.Commit();
};

var renderHome = function(res, objectId, firstSentences, title){
    res.render('../Views/Home/index.ejs', {
        locals: { objectId : objectId, sentences : firstSentences, title: title }
    });
};

var getRandomStory = function(callback, ip){
	if(Math.random() > 0.9){
		callback(null, null);
	}else{
		var rand = Math.random() * 10000000;
		var story = models.Story;           
		
		story.findOne()
			.select('sentences __id title')
			//.where('sentences.ip').ne(ip)
			.where('ended').equals(false)
			.where('random').lt(rand)        
			.exec(function(err, result){            
				if(result === null){
					story.findOne()
						.select('sentences __id title')
						//.where('sentences.ip').ne(ip)
						.where('ended').equals(false)
						.where('random').gt(rand)                    
						.exec(callback);
				}
				else{
				   callback(err, result);
				}
		});
	}
};