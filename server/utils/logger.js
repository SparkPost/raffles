const winston = require('winston')

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: () => {
        return new Date().toISOString()
      },
      formatter: (options) => {
        // Return string will be passed to logger.
        return `${options.timestamp()} ${options.level.toUpperCase()}: ${undefined !== options.message ? options.message : ''}`
      }
    })
  ]
})
