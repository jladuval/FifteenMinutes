var mongoose = require('mongoose');
var schemas = require('./schemas');

exports.Story = mongoose.model('story', schemas.Story);
exports.BannedUser = mongoose.model('banneduser', schemas.BannedUser);