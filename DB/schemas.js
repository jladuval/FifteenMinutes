var mongoose = require('mongoose');

var Schema = mongoose.Schema;
    
var story =  
    new Schema({
      id: { type: Number, index: true },
      sentences: [{
        text : String,
        order: Number,
        ip : String
        }],
      sentencecount : {type : Number, default : 0 },
      intialteller: String,
      title: String,
      ended: {type : Boolean, default : false},
      random: Number //  Yes, this is horrible. MongoDB is a little silly in this regard. See here http://cookbook.mongodb.org/patterns/random-attribute/ 
    });

story.methods.setup = function(){
    this.random = Math.round(Math.random() * 10000000);
};

exports.Story = story;
    