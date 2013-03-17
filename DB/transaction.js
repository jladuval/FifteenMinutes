var mongoose = require('mongoose');
var models = require('./models');


mongoose.connect('mongodb://mongo_jacob:Horsecruncher@widmore.mongohq.com:10000/fifteenmins');


var closeConnectionToDb = function(){
    mongoose.connection.close();
};

var actions = [];

var add = function(query){
    actions.push(query)
}

var commit = function(){

    for (var i = 0; i < actions.length; i++) {
        actions[i]();
    }
}

exports.Add = add;
exports.Commit = commit;
