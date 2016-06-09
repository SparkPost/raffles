'use strict';

var md5 = require('md5')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , strat;

strat = new BasicStrategy(function(uid, password, next) {
  if (uid === process.env.USERNAME && md5(password) === process.env.PASSWORD_HASH) {
    return next(null, {});
  }
  return next(null, false);
});

passport.use(strat);

module.exports = passport.authenticate('basic', { session: false });
