var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

exports.GetIndex = function(req, res){
    transaction.Add(function(){
        var id = new ObjectId(req.query.id);
        var ip = req.connection.remoteAddress;
        models.Story.findOne()
            .where('_id').equals(id)
            .exec(function(err, story){
                if(story){
                    renderStory(res, story.sentences);                    
                }
                else{
                    console.log('error1');                   
                }
            });
    });
    transaction.Commit();
};

var renderStory = function(res, allsentences){
    res.render('../Views/Story/index.ejs', {
        layout:false,
        locals: { sentences : allsentences }
    });
};