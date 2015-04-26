var models = require('../DB/models')
var ObjectId = require('mongoose').Types.ObjectId

var sentenceHomeCount = 2

exports.GetHome = function (req, res) {
  var ip = getIp(req)

  getRandomStory(function (err, data) {
    if (data === null) {
      renderHome(res, null, null, null, 0)
    }
    else {
      getStoryCountFromIp(ip, function (err, count) {
        var sentences = data.sentences
        var sortedSentences = sentences.sort(function (a, b) {
          return a.order - b.order
        })
        var viewSentences
        if (sortedSentences && sortedSentences.length > sentenceHomeCount) {
          viewSentences = sortedSentences.splice(sortedSentences.length - sentenceHomeCount, sortedSentences.length)
        } else {
          viewSentences = sortedSentences
       }
        renderHome(res, data._id, viewSentences, data.title, count)
      })
    }
  }, req.connection.remoteAddress)
}

function getRandomStory (callback, ip) {
  if (Math.random() > 0.95) {
    callback(null, null)
  } else {
    var story = models.Story
    var now = new Date()
    var seconds = 60
    var before = new Date(now.getTime() - seconds * 1000)
    story
      .count()
      .where('ended').equals(false)
      .or([{lastserved: null}, {lastserved: {"$lte": before}}])
      .exec(function (err, count) {
        selectStoryWithCount(callback, err, count, before)
      })
  }
}

function selectStoryWithCount (callback, err, count, before) {
  var random = Math.round(Math.random() * count)
  var story = models.Story
  if (count === 0) {
    callback(err, null)
  } else {
    var rand = Math.floor(random)
    story.findOne()
      .select('sentences __id title lastserved')
      .where('ended').equals(false)
      .or([{lastserved: null}, {lastserved: {"$lte": before}}])
      .skip(rand)
      .exec(function (err, result) {
        if (result) {
          result.lastserved = new Date()
          result.save(function (err, data) {
            callback(err, result)
          })
        } else {
          callback(err, result)
        }
      })
  }
}

exports.PostHome = function (req, res) {
  var id = new ObjectId(req.body.objectId)
  models.Story.findOne()
    .where('_id').equals(id)
    .exec(function (err, story) {
      saveOrUpdateStory(err, story, req, res)
    })
}

var renderHome = function (res, objectId, firstSentences, title, endCount) {
  res.render('../Views/Home/index.ejs', {
    locals: {objectId: objectId, sentences: firstSentences, title: title, end: (endCount === 0)}
  })
}

var saveOrUpdateStory = function (err, story, req, res) {
  var id = new ObjectId(req.body.objectId)
  var ip = getIp(req)

  if (story) {
    if (story.sentencecount === 0 && req.body.title !== null) {
      story.title = req.body.title
      story.sentences.push({text: req.body.sentence, ip: ip, order: story.sentencecount})
    }
    else {
      story.sentences.push({text: req.body.sentence, ip: ip, order: story.sentencecount})
    }
    if (req.body.submit != "Submit") {
      getStoryCountFromIp(ip,
        function (err, count) {
            if (count === 0) {
              story.ended = true
              story.endeddate = new Date()
              story.endedip = ip
            }
            story.sentencecount++
            story.save()
            res.redirect('/Story?id=' + id)
      })
    } else {
      story.sentencecount++
      story.save()
      res.redirect('/Story?id=' + id)
    }
  }
  else {
    var newStory = new models.Story()
    newStory.setup()
    newStory.title = req.body.title
    newStory.intialteller = ip
    newStory.sentences.push({text: req.body.sentence, ip: ip, order: 0})
    newStory.sentencecount++
    newStory.save(function (err, data) {
      id = data._id
      res.redirect('/Story?id=' + id)
    })
  }
}

function getIp (req) {
  var ip = null
  var forwardedIpsStr = req.headers['x-forwarded-for']
  if (forwardedIpsStr) {
    ip = forwardedIpsStr
  }
  if (!ip) {
    ip = req.connection.remoteAddress
  }
  return ip
}

function getStoryCountFromIp (ip, cb) {
  var now = new Date()
  var minutes = 40
  var before = new Date(now.getTime() - minutes * 60000)
  models.Story
    .count()
    .where('endedip').equals(ip)
    .where('endeddate').gte(before)
    .exec(cb)
}
