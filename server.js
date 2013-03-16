var express = require('express');

var server = express();

server.user(express.bodyParser());

server.use(express.static(__dirname + '/Public'))

var home = require('./Controllers/home');
server.get('/', home.GetHome);
server.post('/', home.PostHome)

server.listen(process.env.PORT);
console.log('started');