/**
 * Created by MForever78 on 15/5/9.
 */

var debug = require('debug')('QSFamily:userModel');

module.exports = {
  getUserById: function(userid) {
    debug('userid: ' + userid);
    return Knex('user')
      .where({id: userid})
      .then(function(rows) {
        if (rows.length === 0) {
          debug('no user found with userid: ' + userid);
          return false;
        }
        return rows[0];
      });
  }
};

