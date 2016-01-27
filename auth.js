'use strict';

var md5 = require('md5')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , strat;

strat = new BasicStrategy(function(uid, passwd, next) {
  if (uid === 'devrel' && md5(passwd) === '0e7d04e99a4400d4c6964735d411c30b') {
    return next(null, {});
  }
  return next(null, false);
});

passport.use(strat);

module.exports = passport.authenticate('basic', { session: false })
