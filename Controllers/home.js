var models = require('../DB/models');
var transaction = require('../DB/transaction');

exports.GetHome = function(req, res){
  var body = 'Hello Worldasdfsadfsdf';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
  res.send('Hello Worldasdasdasd');
  
  transaction.Add(function(){
      console.log('2');
      var user = new models.User();
      user.title = "TEST TITLE5";
      user.save();
  });
  
  transaction.Commit();
};