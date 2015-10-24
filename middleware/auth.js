/**
 * Created by MForever78 on 15/10/24.
 */

module.exports = function(role) {
  return function(req, res, next) {
    if (!(req.session.user && req.session.user.role === role)) {
      res.session = null;
      return res.redirect('/');
    }
    next();
  }
};