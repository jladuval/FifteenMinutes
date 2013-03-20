var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

exports.GetHome = function(req, res){
    transaction.Add(function(){
        getRandomStory(function(err, data){
		console.log(data);
            if(data === null){
                var story = new models.Story();
                story.setup();
                story.intialteller = req.connection.remoteAddress;
                story.save(function(){
                    renderHome(res, story._id, null, null);
                });
            }
            else{
                renderHome(res, data._id, data.sentences, data.title);
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
                    story.sentencecount++;
                    story.save();
                }
                else{
                    console.log('error');             
                }
            });
    });
    transaction.Commit();
    res.redirect('/Story?id=' + id);
};

var renderHome = function(res, objectId, firstSentences, title){
    res.render('../Views/Home/index.ejs', {
        locals: { objectId : objectId, sentences : firstSentences, title: title }
    });
};

var getRandomStory = function(callback, ip){
    var rand = Math.random() * 10000000;
	console.log(rand);
    var story = models.Story;           
    
    story.findOne()
        .select('sentences __id title')
        //.where('sentences.ip').ne(ip)
        .where('ended').equals(false)
        .where('random').gt(rand)        
        .exec(function(err, result){            
            if(result === null){
                story.findOne()
					.select('sentences __id title')
					//.where('sentences.ip').ne(ip)
					.where('ended').equals(false)
                    .where('random').lt(rand)                    
                    .exec(callback);
            }
            else{
               callback(err, result);
            }
    });
};