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
      var role;
      if (req.user) {
        role = req.user.role;
      }
      res.json({
        code: Message.ok,
        news: news[0],
        role: role
      });
    })
    .catch(function(err) {
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
});

app.post("/post", function(req, res, next) {
  if (!req.user) {
    res.json({
      code: Message.forbidden
    })
  } else {
    var data = {
      title: req.body.title,
      author: req.user.name,
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

app.post("/delete", function(req, res, next) {
  if (!req.user) {
    res.json({
      code: Message.forbidden
    });
  } else {
    News.deleteNews(req.body.newsid)
      .then(function() {
        res.json({
          code: Message.ok
        });
      })
      .catch(function(err) {
        err.message = "Delete news error";
        next(err);
      });
  }
});

app.post("/update", function(req, res, next) {
  if (!req.user) {
    res.json({
      code: Message.forbidden
    });
  } else {
    News.updateNews(req.body.newsid, req.body.news)
      .then(function() {
        res.json({
          code: Message.ok
        });
      })
      .catch(function(err) {
        err.message = "Update news error";
        next(err);
      });
  }
});