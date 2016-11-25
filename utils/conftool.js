'use strict'
const logger = require('./logger')

let conf = require('../.default.conf')
try {
  conf = Object.assign(conf, require('../conf'))
} catch (err) {
  logger.warn('No conf defined; using defaults')
}

logger.info('conf = ' + JSON.stringify(conf, null, 2))

exports.conf = conf
