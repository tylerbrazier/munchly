'use strict'
const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const logger = require('./utils/logger')
const conf = require('./utils/conftool').conf

mongoose.connect(conf.db)
const db = mongoose.connection

db.on('error', (err) => logger.error(err))

db.once('open', () => {
  const app = express()
  app.set('x-powered-by', false)

  app.use(morgan('short', {stream: logger.stream}))
  app.use(express.static('local/web'))
  app.use(express.static('web'))
  app.use('/api', require('./routes/api'))

  const tlsOpts = {
    key: fs.readFileSync('tls/' + conf.https.key),
    cert: fs.readFileSync('tls/' + conf.https.cert),
  }

  http.createServer(app).listen(conf.http.port)
  https.createServer(tlsOpts, app).listen(conf.https.port)
})
