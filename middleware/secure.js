// Returns an object with middleware functions
//   https - redirect your route to https
//   auth  - authenticate requests to this route using basic auth

const basicAuth = require('basic-auth')
const admin = require('../utils/conftool').conf.admin
const logger = require('../utils/logger')


exports.https = function(req, res, next) {
  if (!req.secure)
    res.redirect('https://' + req.hostname + req.originalUrl)
  else
    next()
}


exports.auth = function(req, res, next) {
  const creds = basicAuth(req)
  if (!creds) {
    return forbid(res, next)
  } else if (creds.name !== admin.user || creds.pass !== admin.password) {
    logger.warn(`LOGIN FAILED: user=${creds.name} pass=${creds.pass}`)
    return forbid(res, next)
  } else {
    return next()
  }
}

function forbid(res, next) {
  res.status(401).setHeader('WWW-Authenticate', `Basic realm="Admin"`)
  return next(new Error('Invalid username:password.'))
}
