var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

var sentenceHomeCount = 2;

exports.GetHome = function(req, res){
    transaction.Add(function(){
        getRandomStory(function(err, data){
            if(data === null){                
				renderHome(res, null, null, null);
            }
            else{
				var sentences = data.sentences;
				if(sentences && sentences.length > sentenceHomeCount ){
					sentences = sentences.splice(sentences.length - sentenceHomeCount, sentences.length);
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
        models.Story.findOne()
            .where('_id').equals(id)
            .exec(function(err, story){               
				saveOrUpdateStory(err, story, req, res);
            });
    });
    transaction.Commit();
};

var renderHome = function(res, objectId, firstSentences, title){
    res.render('../Views/Home/index.ejs', {
        locals: { objectId : objectId, sentences : firstSentences, title: title }
    });
};

var saveOrUpdateStory = function(err, story, req, res){
    var id = new ObjectId(req.body.objectId);
    var ip = req.connection.remoteAddress;
    if(story){
        if(story.sentencecount === 0 && req.body.title !== null){
            story.title = req.body.title;
            story.sentences.push({text: req.body.sentence, ip : ip, order : story.sentencecount});
        }
        else{
            story.sentences.push({text: req.body.sentence, ip : ip, order : story.sentencecount});
        }
		if(req.body.submit != "Submit"){
			story.ended = true;
			story.endeddate = new Date();
		}
        story.sentencecount++;
        story.save();
		res.redirect('/Story?id=' + id);
    }
    else{
		var newStory = new models.Story();
		newStory.setup();
		newStory.title = req.body.title;
		newStory.intialteller = req.connection.remoteAddress;
		newStory.sentences.push({text: req.body.sentence, ip : ip, order : story.sentencecount});
		newStory.sentencecount++;
		newStory.save(function(err, data){
			id = data._id;
			res.redirect('/Story?id=' + id);
		}); 
    }
};

var getRandomStory = function(callback, ip){
	if(Math.random() > 0.95){
		callback(null, null);
	}else{
		var story = models.Story;
        var now = new Date();
        var seconds = 40;
        var before = new Date(now.getTime() - seconds*1000);
		story
			.count()
			.where('ended').equals(false)
            .or([{ lastserved: null }, { lastserved: {"$lte": before} }])
			.exec(function(err, count){
				selectStoryWithCount(callback, err, count, before);
			});		
	}
};

var selectStoryWithCount = function(callback, err, count, before){
	var random = Math.round(Math.random() * count);
	var story = models.Story;
	if(count === 0){
		callback(err, null);
	} else {
		var rand = Math.floor(random);
		story.findOne()
			.select('sentences __id title')
			.where('ended').equals(false)
            .or([{ lastserved: null }, { lastserved: {"$lte": before} }])
			.skip(rand)
			.exec(function(err, result){
                callback(err, result);
                if(result){
                    result.lastserved = new Date();
                    result.save();
                }
			});
	}
};