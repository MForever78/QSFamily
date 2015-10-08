/**
 * Created by MForever78 on 15/9/10.
 */

var debug = require('debug')('QSFamily:attachmentModel');

module.exports = {
  getCategory: function() {
    return Knex('attachment_category');
  },

  updateCategory: function(id, data) {
    return Knex('attachment_category')
      .where('id', id)
      .update(data);
  },

  deleteCategory: function(id) {
    return Knex('attachment_category')
      .where('id', id)
      .del();
  },

  createCategory: function(data) {
    return Knex('attachment_category')
      .insert(data);
  },

  getAttachmentsByCategory: function(id) {
    return Knex('attachment')
      .where('category_id', id);
  },

  createAttachment: function(data) {
    return Knex('attachment')
      .insert(data);
  },

  deleteAttachment: function(id) {
    return Knex('attachment')
      .where('id', id)
      .del();
  },

  updateAttachment: function(id, data) {
    return Knex('attachment')
      .where('id', id)
      .update(data);
  }
};
