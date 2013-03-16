var mongoose = require('mongoose');
var schemas = require('./schemas');

exports.User = mongoose.model('user', schemas.User);