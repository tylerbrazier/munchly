'use strict'
// Tool for managing the db connection for tests

const mongoose = require('mongoose')

const defaultConf = {
  db: 'mongodb://localhost/test',
  preDrop: false,   // if true, drop the db upon connecting
  postDrop: false,  // if true, drop the db before disconnecting
  checkEmpty: true, // if true, immediately disconnect if db isn't empty
}

module.exports = function(conf) {
  conf = Object.assign(defaultConf, conf)

  return {
    open: (callback) => open(conf, callback),

    close: (callback) => close(conf, callback),

    drop: () => drop(conf.db), // this is blocking
  }

}

// http://mongoosejs.com/docs/api.html#connection_Connection-readyState
const states = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

function open(conf, callback) {
  let s = mongoose.connection.readyState
  if (s !== 0)
    return callback(new Error(`Not opening because mongoose is ${states[s]}`))

  mongoose.connect(conf.db, (err) => {
    log(`Connecting to ${conf.db}`)
    if (err)
      return callback(err)
    if (conf.preDrop)
      drop(conf)
    if (conf.checkEmpty)
      return checkEmpty(conf, callback)
    callback()
  })
}

function close(conf, callback) {
  if (conf.postDrop)
    drop(conf)
  log(`Closing connection to ${conf.db}`)
  mongoose.connection.close(callback)
}

function drop(conf) {
  log(`Dropping ${conf.db}`)
  // dropDatabase() is blocking
  // https://docs.mongodb.org/manual/reference/method/db.dropDatabase/
  mongoose.connection.db.dropDatabase()
}

// if db isn't empty, disconnect
function checkEmpty(conf, callback) {
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err)
      return callback(err)
    else if (collections.length != 0) {
      log(`${conf.db} is not empty`)
      return close(conf, callback)
    }
    callback()
  })
}

function log(msg) {
  console.log(`dbtool: ${msg}`)
}

