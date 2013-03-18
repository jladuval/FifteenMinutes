var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

exports.GetHome = function(req, res){
    transaction.Add(function(){
        getRandomStory(function(err, data){
            if(data === null){
                var story = new models.Story();
                story.setup();
                story.save(function(){
                    renderHome(res, story._id, null);
                });
            }
            else{
                renderHome(res, data._id, data.sentences);
            }
        }, req.connection.remoteAddress);        
    });
    transaction.Commit();
};

exports.PostHome = function(req, res){
    transaction.Add(function(){
        var id = new ObjectId(req.body.objectId);
        models.Story.findOne()
            .where('_id').equals(id)
            .exec(function(err, story){
                if(story && story.sentences){        
                    story.sentences.push({text: req.body.sentence, ip : req.connection.remoteAddress, order : story.sentencecount});
                    story.sentencecount++;
                    story.save();
                    renderStory(res, story.sentences);
                }
                else{
                    console.log(err);
                    renderHome(res, id, null);
                }
            });
        
    });
    transaction.Commit();
};

var renderHome = function(res, objectId, firstSentences){
    res.render('../Views/Home/index.ejs', {
        layout:false,
        locals: { objectId : objectId, sentences : firstSentences }
    });
};

var renderStory = function(res, allsentences){
    res.render('../Views/Story/index.ejs', {
        layout:false,
        locals: { sentences : allsentences }
    });
};

var getRandomStory = function(callback, ip){
    console.log(ip);
    var rand = Math.random();
    var story = models.Story;
    var query =  story.findOne()
        .select('sentences __id')
        .where('sentences.ip').ne(ip)
        .where('ended').equals(false);            
    
    query
        .where('random').gt(rand)        
        .exec(function(err, result){            
            if(result === null){
                query
                    .where('random').lt(rand)                    
                    .exec(callback);
            }
            else{
               callback(err, result);
            }
    });
};