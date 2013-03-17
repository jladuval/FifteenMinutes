var models = require('../DB/models');
var transaction = require('../DB/transaction');
var $ = require('jquery-deferred');

exports.GetHome = function(req, res){
    res.render('../Views/Home/index.ejs', {
        layout:false
    });
};

exports.PostHome = function(req, res){
//    transaction.Add(function(){
//        story.sentences.push([{text: req.body.sentence, ip : req.connection.remoteAddress, order : 1}]);
//        story.save();
//    });
    
    transaction.Add(function(){
        getRandomStory(function(data){
            res.send(data); 
        });
    });
    transaction.Commit();
};

var getRandomStory = function(callback){
    var rand = Math.random();
    var story = models.Story;
    story.findOne( { random : { $gte : rand } }, 
        'sentences __id', 
        function(err, result){            
            if(result === null){
                story.findOne( { random : { $lte : rand } },
                    'sentences __id', 
                    function(err, result){
                        callback(result);
                    });
            }
            else{
                callback(result);
            }
        }
    );
};