'use strict'
const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const favicon = require('serve-favicon')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const conf = require('./utils/conftool').conf

mongoose.connect(conf.db)
const db = mongoose.connection

db.on('error', (err) => logger.error(err))

db.once('open', () => {
  const app = express()
  app.set('x-powered-by', false)

  app.use(favicon('client/local/favicon.png'))
  app.use(logger.forRequests)
  app.use('/api', require('./routes/api'))
  app.use('/admin', require('./routes/admin'))
  app.use('/local', express.static('client/local'))
  app.use('/', express.static('client/dist'))

  const tlsOpts = {
    key: fs.readFileSync(conf.https.key),
    cert: fs.readFileSync(conf.https.cert),
  }

  http.createServer(app).listen(conf.http.port)
  https.createServer(tlsOpts, app).listen(conf.https.port)
})
