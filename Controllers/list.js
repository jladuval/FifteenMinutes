var models = require('../DB/models');
var transaction = require('../DB/transaction');
var ObjectId = require('mongoose').Types.ObjectId;

var pagesize = 20;

exports.GetIndex = function(req, res){
	var page = req.query.page;
	if(page && page > 0){
		transaction.Add(function(){
			var story = models.Story;
			story.count()
				.where('ended').equals('true')
				.exec(function(err, count){
					if(count == 0){
						res.redirect('/');
					}
					else{
						var pagecount = Math.ceil(count/pagesize);
						story.find()						
							.select('_id title')
							.where('ended').equals('true')
							.sort('-endeddate')
							.skip((pagesize * (page - 1)))
							.limit(pagesize)						
							.exec(function(err, data){
								if(data !== null){
								   renderList(res, data, page, pagecount);
								}
								else{
									res.redirect('/' + err);						                  
								}
							});
					}	
				});			
		});
		transaction.Commit();
	} else {
		res.redirect('/');
	}
};

var renderList = function(res, stories, currentpage,  pages){
    res.render('../Views/List/index.ejs', {
        locals: { stories : stories, currentpage: currentpage,  pages : pages }
    });
};