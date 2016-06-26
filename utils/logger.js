const winston = require('winston')
const moment = require('moment-timezone')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: timestamp,
    }),
    new (winston.transports.File)({
      filename: __dirname + '/../local/server.log',
      json: false,
      timestamp: timestamp,
    })
  ]
})

function timestamp() {
  return moment().tz('America/Chicago').format()
}

module.exports = logger
module.exports.stream = { write: (data) => logger.info(data.trim()) }
