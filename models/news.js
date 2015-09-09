/**
 * Created by MForever78 on 15/5/23.
 */

var debug = require('debug')('QSFamily:newsModel');

exports.getNews = function(query) {
  var offset = (query.page - 1) * query.limit;
  return Knex('news')
    .innerJoin('user', 'news.author_id', 'user.id')
    .select('news.id', 'news.title', 'user.name as author', 'news.content', 'news.create_at', 'news.update_at')
    .orderBy(query.orderBy, query.order)
    .limit(query.limit)
    .offset(offset);
};

exports.getNewsById = function(id) {
  return Knex('news')
    .innerJoin('user', 'news.author_id', 'user.id')
    .select('news.id', 'news.title', 'user.name as author', 'news.content', 'news.create_at', 'news.update_at')
    .where('news.id', id);
};

exports.postNews = function(data) {
  return Knex('news')
    .insert(data);
};

exports.deleteNews = function(id) {
  return Knex('news')
    .where('id', id)
    .del();
};

exports.updateNews = function(id, data) {
  return Knex('news')
    .where('id', id)
    .update(data);
};
