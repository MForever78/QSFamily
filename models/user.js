/**
 * Created by MForever78 on 15/5/9.
 */

module.exports = userProfile;

function userProfile(role, userid) {
  debug('fetching user profile with role: ' + role);
  debug('userid: ' + userid);
  return Knex(role)
    .where({id: userid})
    .then(function(rows) {
      if (rows.length === 0) {
        debug('no user found with userid: ' + userid);
        return false;
      }
      return rows[0];
    });
}