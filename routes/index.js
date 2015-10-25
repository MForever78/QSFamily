/**
 * Created by MForever78 on 15/4/27.
 */

var routes = require('node-require-directory')(__dirname);

module.exports = function(app) {
  app.use('/$', function(req, res, next) {
    News.find({})
      .populate('author')
      .then(function(newsList) {
        // Add following property:
        //    news.date with format: "XXXX 年 YY 月 ZZ 日"
        //    news.url: "/news/<ObjectId>"
        newsList = newsList.map(function(news) {
          var date = news.createAt;
          news.date = date.getFullYear() + ' 年 ' + (date.getMonth() + 1) + ' 月 ' + date.getDate() + ' 日';
          news.url = "/news/" + news._id;
          return news;
        });
        res.render('index', {
          session: req.session,
          newsList: newsList
        });
      })
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
    console.log(err.stack);
    res.sendStatus(500);
  });
};

