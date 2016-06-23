const logger = require('./logger')

let conf = require('../.default.conf')
try {
  conf = Object.assign(conf, require('../conf'))
} catch (err) {
  logger.warn('No conf defined; using defaults')
}
logger.info(conf)

exports.conf = conf