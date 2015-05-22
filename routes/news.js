/**
 * Created by MForever78 on 15/5/22.
 */

var express = require('express');
var app = module.exports = express();
var debug = require('debug')('QSFamily:newsRoute');

app.get('/', function(req, res, next) {
  if (req.param.newsid) {
    News({ id: req.param.newsid })
      .then(function(news) {
        if (!news) {
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
      sortBy: req.param.sortBy || 'create_at',
      order: req.param.order || 'desc'
    };
    News(query)
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