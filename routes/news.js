/**
 * Created by MForever78 on 15/5/22.
 */

var express = require('express');
var app = module.exports = express();
var debug = require('debug')('QSFamily:newsRoute');

app.get('/', function(req, res, next) {
  if (req.param.newsid) {
    News.getNewsById(req.param.newsid)
      .then(function(news) {
        if (news.length === 0) {
          debug('Not found news: ' + req.param.newsid);
          res.json({
            code: Message.notFound
          });
        }
        res.json({
          code: Message.ok,
          news: news[0]
        });
      })
      .catch(function(err) {
        err.message = "Get news " + req.param.newsid + " error";
        next(err);
      });
  } else {
    var query = {
      limit: req.param.limit || 30,
      orderBy: req.param.orderBy || 'create_at',
      order: req.param.order || 'desc'
    };
    News.getNews(query)
      .then(function(news) {
        res.json({
          code: Message.ok,
          news: news
        });
      })
      .catch(function(err) {
        err.message = "Get news list error";
        next(err);
      });
  }
});

app.post("/post", function(req, res, next) {
  if (!req.user) {
    res.json({
      code: Message.forbidden
    })
  } else {
    debug("Prepare posting news");
    debug("token to be verify:", req.user.token);
    req.decrypted = Token.decrypt(req.user.token);
    debug("token decrypted:", req.decrypted);
    var data = {
      title: req.body.title,
      author: req.decrypted.name,
      content: req.body.content
    };
    News.postNews(data)
      .then(function() {
        res.json({
          code: Message.ok
        });
      })
      .catch(function(err) {
        err.message = "Post news error";
        next(err);
      });
  }
});