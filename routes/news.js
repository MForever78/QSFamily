/**
 * Created by MForever78 on 15/5/22.
 */

var express = require('express');
var app = module.exports = express();
var debug = require('debug')('QSFamily:newsRoute');
var Promise = require("bluebird");

app.get("/:newsid", function(req, res, next) {
  debug("request news by id: " + req.params.newsid);
  News.getNewsById(req.params.newsid)
    .then(function(news) {
      if (news.length === 0) {
        debug('Not found news: ' + req.params.newsid);
        res.json({
          code: Message.notFound
        });
      }
      debug('News found');
      res.json({
        code: Message.ok,
        news: news[0]
      });
    }).catch(function(err) {
      err.message = "Get news " + req.param.newsid + " error";
      next(err);
    });
});

app.get('/', function(req, res, next) {
  var query = {
    limit: req.param.limit || 30,
    orderBy: req.param.orderBy || 'create_at',
    order: req.param.order || 'desc'
  };
  News.getNews(query)
    .then(function(newsList) {
      res.json({
        code: Message.ok,
        newsList: newsList
      });
    }).catch(function(err) {
      err.message = "Get news list error";
      next(err);
    });
});

app.post("/", function(req, res, next) {
  if (!req.user) {
    res.json({
      code: Message.forbidden
    });
  } else {
    var data = {
      title: req.body.title,
      author: req.user.name,
      content: req.body.content
    };
    News.postNews(data)
      .then(function(id) {
        News.getNewsById(id)
          .then(function(news) {
            res.json({
              code: Message.ok,
              news: news[0]
            });
          });
      }).catch(function(err) {
        err.message = "Post news error";
        next(err);
      });
  }
});

app.delete("/:newsid", function(req, res, next) {
  if (!req.user) {
    res.json({
      code: Message.forbidden
    });
  } else {
    News.deleteNews(req.params.newsid)
      .then(function() {
        res.json({
          code: Message.ok
        });
      }).catch(function(err) {
        err.message = "Delete news error";
        next(err);
      });
  }
});

app.put("/:newsid", function(req, res, next) {
  if (!req.user) {
    debug('false user want to update news');
    res.json({
      code: Message.forbidden
    });
  } else {
    News.updateNews(req.params.newsid, req.body)
      .then(function() {
        debug('update news', req.params.newsid, 'succeed');
        News.getNewsById(req.params.newsid)
          .then(function(news) {
            res.json({
              code: Message.ok,
              news: news[0]
            });
          });
      }).catch(function(err) {
        err.message = "Update news error";
        next(err);
      });
  }
});
