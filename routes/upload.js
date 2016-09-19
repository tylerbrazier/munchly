// Handles processing and storing of uploaded files thru multipart POST.
// Before storage, file names are sanitized so they only contain alphanumeric,
// underscore, and dot characters.
// All files are stored in DIR (defined below).
//
// Jpegs are also resized according to the x and y form params:
// For each uploaded jpeg, the original image is renamed (after sanitizing)
// with a leading dot (making it hidden), then read thru lwip, which resizes
// the image according to the x and y form params, and saved with the same name
// but without the leading dot. This way, the original uploaded image is still
// accessible on the fs but not shown in the api.

const DIR = __dirname + '/../client/local'
const MIN_X = 100
const MIN_Y = 100
const router = require('express').Router()
const secure = require('../middleware/secure')
const fs = require('fs')
const logger = require('../utils/logger')
const conf = require('../utils/conftool').conf
const lwip = require('lwip')
const async = require('async')
const multer = require('multer')

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, f, cb) => cb(null, DIR),
    filename: (req, f, cb) => cb(null, fixFileName(f)),
  })
})

module.exports = router

router.use(secure.https, secure.auth)

router.get('/', (req, res, next) => {
  fs.readdir(DIR, (err, files) => {
    if (err)
      return next(err)

    // don't show hidden files
    files = files.filter( (f) => !f.startsWith('.') )
    res.json(files)
  })
})

// the argument to upload.array should match the name on the html input
router.post('/',
  upload.array('files'),
  parseResizeParams,
  resizeHiddenFiles,
  (req, res, next) => {
    res.json(res.filenames)
  })

function fixFileName(f) {
  var result = f.originalname
    .replace(/[^A-Za-z0-9_.]/, '_') // replace nonalphanumeric chars with _
    .replace(/^\.+/, '')            // remove any leading dots

  // Prepend jpegs with a dot because the non-dot version will
  // be resized. The dot version is the original.
  if (f.mimetype == 'image/jpeg')
    result = '.' + result

  return result
}


// private middleware to validate and set req.body.x/y to integers
function parseResizeParams(req, res, next) {
  function err() {
    res.statusCode = 400
    next(new Error('Invalid x/y resize'))
  }

  if (!req.body || !req.body.x || !req.body.y)
    return err()

  var x = parseInt(req.body.x, 10)
  var y = parseInt(req.body.y, 10)
  if (!x || !y || x < MIN_X || y < MIN_Y)
    return err()

  req.body.x = x
  req.body.y = y

  next()
}

// adds res.filenames
function resizeHiddenFiles(req, res, next) {
  var result = []
  async.each(req.files, (f, callback) => {

    if (!f.filename.startsWith('.')) {
      result.push(f.filename)
      callback()
    } else {
      resize(f.filename, req.body.x, req.body.y, (err, newFilename) => {
        if (err)
          return callback(err)
        result.push(newFilename)
        callback()
      })
    }

  }, (err) => {
    if (err)
      return next(err)
    res.filenames = result
    next()
  })
}

function resize(filename, x, y, callback) {
  logger.info('compressing ' + filename)
  lwip.open(DIR + '/' + filename, (err, image) => {
    if (err)
      return callback(err)
    image.resize(x, y, (err, image) => {
      if (err)
        return callback(err)
      var newFilename = filename.replace(/^\./, '') // remove leading dot
      image.writeFile(DIR + '/' + newFilename, (err) => {
        if (err)
          return callback(err)
        callback(null, newFilename)
      })
    })
  })
}
