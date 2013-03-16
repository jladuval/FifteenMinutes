var mongoose = require('mongoose');
var models = require('./models');

var connectToDb = function(){
    mongoose.connect('mongodb://mongo_jacob:Horsecruncher@widmore.mongohq.com:10000/fifteenmins');
};

var closeConnectionToDb = function(){
    mongoose.connection.close();
};

var actions = [];

var add = function(query){
    actions.push(query)
}

var commit = function(){
    connectToDb();
    
    for (var i = 0; i < actions.length; i++) {
        actions[i]();
    }
    
    closeConnectionToDb();
}

exports.Add = add;
exports.Commit = commit;
