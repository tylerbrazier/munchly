'use strict'
const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const favicon = require('serve-favicon')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const secure = require('./middleware/secure')
const conf = require('./utils/conftool').conf

mongoose.connect(conf.db)
const db = mongoose.connection

db.on('error', (err) => logger.error(err))

db.once('open', () => {
  const app = express()
  app.set('x-powered-by', false)

  // favicon may not have been uploaded yet
  try {
    app.use(favicon(__dirname + '/client/local/favicon.ico'))
  } catch (err) {
    logger.warn('No favicon')
  }

  app.use(logger.forRequests)
  app.use('/api', require('./routes/api'))
  app.use('/admin', secure.https, secure.auth)
  app.use(express.static('client/public'))

  const tlsOpts = {
    key: fs.readFileSync(conf.https.key),
    cert: fs.readFileSync(conf.https.cert),
  }

  http.createServer(app).listen(conf.http.port)
  https.createServer(tlsOpts, app).listen(conf.https.port)
})
