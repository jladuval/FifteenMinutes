var express = require('express');

var server = express();

server.get('/', require('./Controllers/home').GetHome);

server.listen(process.env.PORT);
console.log('started');