/**
 * Created by MForever78 on 15/6/11.
 */

var decrypt = require("../token-encryptor").decrypt;

module.exports = function(req, res, next) {
  "use strict";
  if (!req.user || !req.user.token) {
    next();
  } else {
    var decrypted = decrypt(req.user.token);
    for (let prop in decrypted) {
      if (decrypted.hasOwnProperty(prop)) {
        req.user[prop] = decrypted[prop];
      }
    }
    next();
  }
};
