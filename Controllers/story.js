var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

exports.GetIndex = function(req, res){
    transaction.Add(function(){
        var id = new ObjectId(req.query.id);
        var ip = req.connection.remoteAddress;
        models.Story.findOne()
            .where('_id').equals(id)
            .where('sentences.ip').equals(ip)
            .exec(function(err, story){
                if(err){
                   console.log(err);
                }
                else{
                    renderStory(res, story.sentences, story.title);                      
                }
            });
    });
    transaction.Commit();
};

var renderStory = function(res, allsentences, title){
    res.render('../Views/Story/index.ejs', {
        locals: { sentences : allsentences, title: title }
    });
};