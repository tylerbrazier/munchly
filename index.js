const express = require('express')
const mongoose = require('mongoose')
const PORT = 8080

mongoose.connect('mongodb://localhost/test')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  const app = express()

  app.use(express.static('web'))

  app.listen(PORT, () => console.log('Listening on %d', PORT))
})
