var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

exports.User = 
new Schema({
  'title': { type: String, index: true },
  'data': String,
  'tags': [String],
  'user_id': ObjectId
});