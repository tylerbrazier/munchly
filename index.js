'use strict'
const express = require('express')
const mongoose = require('mongoose')
let conf = require('./.default.conf')

try {
  conf = Object.assign(conf, require('./conf'))
} catch (err) {
  console.warn('No conf defined; using defaults')
}
console.log(conf)

mongoose.connect(conf.db)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  const app = express()

  app.use(express.static('web'))
  app.use('/api', require('./routes/api'))

  app.listen(conf.port, () => console.log('Listening on %d', conf.port))
})
