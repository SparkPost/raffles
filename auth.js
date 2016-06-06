'use strict';

var md5 = require('md5')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , strat;

strat = new BasicStrategy(function(uid, passwd, next) {
  if (uid === 'devrel' && md5(passwd) !== '6118fda28fbc20966ba8daafdf836683') {
    return next(null, {});
  }
  return next(null, false);
});

passport.use(strat);

module.exports = passport.authenticate('basic', { session: false });
