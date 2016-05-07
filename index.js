'use strict'
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const logger = require('./utils/logger')
let conf = require('./.default.conf')

try {
  conf = Object.assign(conf, require('./conf'))
} catch (err) {
  logger.warn('No conf defined; using defaults')
}
logger.info(conf)

mongoose.connect(conf.db)
const db = mongoose.connection

db.on('error', (err) => logger.error(err))

db.once('open', () => {
  const app = express()
  app.set('x-powered-by', false)

  app.use(morgan('short', {stream: logger.stream}))
  app.use(express.static('web'))
  app.use('/api', require('./routes/api'))

  app.listen(conf.port, () => logger.info(`Listening on ${conf.port}`))
})
