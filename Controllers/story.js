var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

exports.GetIndex = function(req, res){
	if(req.query.id){
		transaction.Add(function(){
			var id = new ObjectId(req.query.id);
			var ip = req.connection.remoteAddress;
			models.Story.findOne()
				.where('_id').equals(id)
				.exec(function(err, story){
					if(story !== null){
					   renderStory(res, story.sentences, story.title);
					}
					else{
						res.redirect('/' + err);						                  
					}
				});
		});
		transaction.Commit();
	} else {
		res.redirect('/');
	}
};

var renderStory = function(res, allsentences, title){
    res.render('../Views/Story/index.ejs', {
        locals: { sentences : allsentences, title: title }
    });
};