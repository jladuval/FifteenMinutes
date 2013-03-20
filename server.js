var express = require('express');
var engine = require('ejs-locals');

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

server.listen(process.env.PORT);
console.log('started');