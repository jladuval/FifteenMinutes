var models = require('../DB/models'),
  Promise = require('bluebird'),
  pagesize = 20

exports.GetIndex = function (req, res) {
  var page = req.query.page
  if (page && page > 0) {
    var story = models.Story
    story.count()
      .where('ended').equals('true')
      .exec(getStories)
  } else {
    res.redirect('/')
  }

  function getStories (err, count) {
    if (count === 0) {
      res.redirect('/')
    }
    else {
      var story = models.Story
      var pagecount = Math.ceil(count / pagesize)
      story.find()
        .select('_id title')
        .where('ended').equals('true')
        .sort('-endeddate')
        .skip((pagesize * (page - 1)))
        .limit(pagesize)
        .exec(function (err, data) {
          if (data !== null) {
            renderList(res, data, page, pagecount)
          }
          else {
            res.redirect('/')
          }
        })
    }
  }}

var renderList = function (res, stories, currentpage, pages) {
  res.render('../Views/List/index.ejs', {
    locals: {stories: stories, currentpage: currentpage, pages: pages}
  })
}