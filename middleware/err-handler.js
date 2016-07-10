'use strict'
const logger = require('../utils/logger')

module.exports.forJson = (err, req, res, next) => {

  setStatus(err, res)

  if (res.statusCode < 500)
    logger.warn(err.message)
  else
    logger.error(err) // will print the stack trace

  res.json({ message: getMessage(err) })
}

// set statusCode on res based on err (if necessary)
function setStatus(err, res) {

  // must have already been set by earlier middleware e.g. 404.js
  if (res.statusCode !== 200)
    return

  // produced by mongoose validation
  else if (err.name === 'ValidationError')
    return res.statusCode = 400

  // produced by body-parser
  else if (err.status)
    return res.statusCode = err.status

  else
    return res.statusCode = 500
}

function getMessage(err) {

  // produced by mongoose
  if (err.name === 'ValidationError') {
    let messages = []
    for (var path in err.errors)
      messages.push(err.errors[path].message)
    return messages.join('; ')
  }

  else if (err.message)
    return err.message

  else
    return 'Something broke :('
}
