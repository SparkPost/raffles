'use strict';

var pgPromise = require('pg-promise')
  , pgMonitor = require('pg-monitor')
  , config = require('config')
  , pgOptions = {promiseLib: require('q')};

pgMonitor.attach(pgOptions);
pgMonitor.detailed = true;

module.exports = function() {
  return pgPromise(pgOptions)(process.env.WEBHOOK_CONSUMER_DB_URL || config.get('maildburl'));
};
