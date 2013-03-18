var express = require('express');

var server = express();

server.use(express.bodyParser());

server.use(express.static(__dirname + '/Public'));

var home = require('./Controllers/home');
server.get('/', home.GetHome);
server.post('/',home.PostHome);

var story = require('./Controllers/story');
server.get('/Story', story.GetIndex);

server.listen(process.env.PORT);
console.log('started');