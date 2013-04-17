var express = require('express');
var engine = require('ejs-locals');
var mongoose = require('mongoose');

mongoose.connect('mongodb://mongo_jacob:Horsecruncher@widmore.mongohq.com:10000/fifteenmins');

var server = express();

server.use(express.bodyParser());
server.engine('ejs', engine);
server.set('view engine', 'ejs');

server.use(express.static(__dirname + '/Public'));
server.use(express.favicon(__dirname + '/favicon.ico'));

var home = require('./Controllers/home');
server.get('/', home.GetHome);
server.post('/',home.PostHome);

var story = require('./Controllers/story');
server.get('/Story', story.GetIndex);

var list = require('./Controllers/list');
server.get('/List', list.GetIndex);

server.listen(process.env.PORT);
console.log('started');