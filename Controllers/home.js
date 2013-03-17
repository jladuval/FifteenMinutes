var models = require('../DB/models');
var transaction = require('../DB/transaction');

exports.GetHome = function(req, res){
    transaction.Add(function(){
        getRandomStory(function(data){
            if(data === null){
                var story = new models.Story();
                story.setup();
                story.save(function(){
                    renderHome(res, story, null);
                });            
            }
            else{
                renderHome(res, data._id, null);
            }
        });        
    });
    transaction.Commit();
};

exports.PostHome = function(req, res){
//    transaction.Add(function(){
//        story.sentences.push([{text: req.body.sentence, ip : req.connection.remoteAddress, order : 1}]);
//        story.save();
//    });
    
    transaction.Add(function(){
        var result = getRandomStory();
        if(result === null){
            
        }
    });
    transaction.Commit();
};

var renderHome = function(res, objectId, firstSentences){
    res.render('../Views/Home/index.ejs', {
        layout:false,
        locals: { objectId : objectId }
    });
};

var getRandomStory = function(callback){
    var rand = Math.random();
    var story = models.Story;
    var findLessThan = 
        function(){
            story.findOne( { random : { $lte : rand } },
                'sentences __id', 
                function(err, result){
                    callback(result);
                });
        }
    story.findOne( { random : { $gte : rand } }, 
        'sentences __id', 
        function(err, result){            
            if(result === null){
                findLessThan();
            }
            else{
               callback(result);
            }
        }
    );
};