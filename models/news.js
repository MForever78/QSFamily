/**
 * Created by MForever78 on 15/5/23.
 */

var debug = require('debug')('QSFamily:newsModel');

exports.getNews = function(query) {
  var offset = (query.page - 1) * query.limit;
  return Knex('news')
    .orderBy(query.orderBy, query.order)
    .limit(query.limit)
    .offset(offset);
};

exports.getNewsById = function(id) {
  return Knex('news')
    .where({ id: id });
};
