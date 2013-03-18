var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var story =  
    new Schema({
      id: { type: Number, index: true },
      sentences: [{
        text : String,
        order: Number,
        ip : String
        }],
      sentencecount : {type : Number, default : 0 },
      ended: {type : Boolean, default : false},
      random: Number //  Yes, this is horrible. MongoDB is a little silly in this regard. See here http://cookbook.mongodb.org/patterns/random-attribute/ 
    });

story.methods.setup = function(){
    this.random = Math.random();
}

exports.Story = story;
    