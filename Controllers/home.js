var models = require('../DB/models');
var transaction = require('../DB/transaction');

exports.GetHome = function(req, res){
    res.render('../Views/Home/index.ejs', {
        layout:false
    });
};

exports.PostHome = function(req, res){
    transaction.Add(function(){
        var story = new models.Story();
        story.sentences = [{text: req.body.sentence, ip : "12345", order : 1}];
        story.save()
    });  
    transaction.Commit();
    res.send(req.body);
}