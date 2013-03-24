var mongoose = require('mongoose');


mongoose.connect('mongodb://mongo_jacob:Horsecruncher@widmore.mongohq.com:10000/fifteenmins');

function Transaction(){
    var actions = [];
    this.Add = function(query){
        actions.push(query);
    };
    this.Commit = function(){
        for (var i = 0; i < actions.length; i++) {
            actions[i]();
        }
        actions = [];
    };
}

exports.Transaction = Transaction;