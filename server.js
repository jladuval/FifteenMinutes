var express = require('express');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://mongo_jacob:Horsecruncher@widmore.mongohq.com:10000/fifteenmins');

var server = express();
server.get('/hello.txt', function(req, res){
  var body = 'Hello Worldasdfsadfsdf';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});
server.get('/hello.txt', function(req, res){
  res.send('Hello Worldasdasdasd');
});

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

UserSchema = new Schema({
  'title': { type: String, index: true },
  'data': String,
  'tags': [String],
  'user_id': ObjectId
});

var User = mongoose.model('user', UserSchema);

var user = new User();
user.title = "TEST TITLE";
user.save();


server.listen(process.env.PORT);
console.log('started');