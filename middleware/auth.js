/**
 * Created by MForever78 on 15/10/24.
 */

module.exports = function(roles) {
  if (roles.constructor !== Array) {
    var role = roles;
    roles = [];
    roles.push(role);
  }
  return function(req, res, next) {
    if (!(req.session.user && roles.indexOf(req.session.user.role) !== -1)) {
      if (req.session) req.session.destroy();
      return res.redirect('/');
    }
    next();
  }
};