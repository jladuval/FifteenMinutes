var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

exports.Story = 
    new Schema({
      id: { type: Number, index: true },
      sentences: {
            sentence : {
                text : String,
                order: Number,
                ip : String
            }
      },
      ended: {type : Boolean, default : false}
    });