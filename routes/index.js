/**
 * Created by MForever78 on 15/4/27.
 */

var routes = require('node-require-directory')(__dirname);
var moment = require('moment');

module.exports = function(app) {
  app.use('/$', function(req, res, next) {
    News.find({})
      .sort({createAt: 'desc'})
      .populate('author')
      .then(function(newsList) {
        // Add following property:
        //    news.date with format: "XXXX 年 YY 月 ZZ 日"
        //    news.url: "/news/<ObjectId>"
        var newsList = newsList.map(function(news) {
          news.date = moment(news.createAt).format('YYYY 年 MM 月 DD 日 HH: mm');
          news.url = "/news/" + news._id;
          return news;
        });
        return res.render('index', {
          session: req.session,
          newsList: newsList
        });
      }).catch(function(err) {
        return res.render('index', {
          message: {
            type: 'error',
            text: '发生了一些错误'
          }
        });
        throw err;
      });
  });

  Object.keys(routes).forEach(function(key) {
    if (key === 'index') return;
    app.use('/' + key, routes[key]);
  });

  // error handling
  app.use(function(req, res, next) {
    // nothing found
    res.sendStatus(404);
  });

  app.use(function(err, req, res, next) {
    // error
    Logger.error(err.stack);
    res.sendStatus(500);
  });
};

