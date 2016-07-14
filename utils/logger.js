const winston = require('winston')
const moment = require('moment-timezone')
const morgan = require('morgan')

// do not log requests with a url that starts with a word in this list
const skipList = [
  '/js/',
  '/css/',
]

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: timestamp,
    }),
    new (winston.transports.File)({
      filename: __dirname + '/../server.log',
      json: false,
      timestamp: timestamp,
    })
  ]
})

// returns a middleware function for logging requests
logger.forRequests = morgan('short', {
  stream: { write: (data) => logger.info(data.trim()) },
  skip: shouldSkip,
})

module.exports = logger


function timestamp() {
  return moment().tz('America/Chicago').format()
}

// return true if we should skip logging for this request
function shouldSkip(req, res) {
  for (var i in skipList)
    if (req.url.startsWith(skipList[i]))
      return true
  return false
}
