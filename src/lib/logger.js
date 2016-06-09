'use strict';

var winston = require('winston');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return new Date().toISOString();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() + ' ' + options.level.toUpperCase() + ': ' + (undefined !== options.message ? options.message : '');
      }
    })
  ]
});
