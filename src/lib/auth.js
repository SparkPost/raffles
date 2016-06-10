'use strict';

var md5 = require('md5')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , strat;

strat = new BasicStrategy(function(uid, password, next) {
  console.log(md5(password), process.env.PASSWORD_HASH, md5(password) === process.env.PASSWORD_HASH);
  console.log(uid, process.env.BA_USERNAME, uid === process.env.BA_USERNAME);
  if (uid === process.env.BA_USERNAME && md5(password) === process.env.PASSWORD_HASH) {
    return next(null, {});
  }
  return next(null, false);
});

passport.use(strat);

module.exports = passport.authenticate('basic', { session: false });
