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
                    renderHome(res, story.id, null);
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
                console.log(story);
                console.log(story.sentences);
                if(story && story.sentences){        
                    story.sentences.push({text: req.body.sentence, ip : req.connection.remoteAddress, order : 5});
                    story.save();
                }
                else{
                    console.log(err);
                }
                renderStory(res);
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

var renderStory = function(res){
    res.render('../Views/Story/index.ejs', {
        layout:false,
    });
};

var getRandomStory = function(callback, ip){
    var rand = Math.random();
    var story = models.Story;
    var query =  story.findOne().select('sentences __id');            
    
    query
        .where('random').gt(rand)
        //.where('sentences.sentence.ip').ne(ip)
        .exec(function(err, result){            
            if(result === null){
                query
                    .where('random').lt(rand)
                    //.where('sentences.sentence.Ip').ne(ip)
                    .exec(callback);
            }
            else{
               callback(err, result);
            }
    });
};