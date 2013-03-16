var models = require('../DB/models');
var transaction = require('../DB/transaction');

exports.GetHome = function(req, res){
 res.render('../Views/Home/index.ejs', {
    layout:false
});
  
//  transaction.Add(function(){
//      var user = new models.User();
//      user.title = "TEST TITLE5";
//      user.save();
//  });
//  
//  transaction.Commit();
};