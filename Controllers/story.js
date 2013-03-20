var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

exports.GetIndex = function(req, res){
	if(req.query.id){
		transaction.Add(function(){
			var id = new ObjectId(req.query.id);
			var ip = req.connection.remoteAddress;
			var story = models.Story;
			story.findOne()
				.select('sentences __id title')
				.where('_id').equals(id)
				.exec(function(err, data){
					if(story !== null){
					   renderStory(res, data.sentences, data.title);
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