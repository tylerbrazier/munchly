const DIR = __dirname + '/../client/public/local'
const router = require('express').Router()
const secure = require('../middleware/secure')
const fs = require('fs')
const logger = require('../utils/logger')
const multer = require('multer')
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, f, cb) => cb(null, DIR),
    filename: (req, f, cb) => cb(null, sanitizeFileName(f.originalname)),
  })
})

// create the uploads dir if it doesn't exist
try {
  fs.mkdirSync(DIR)
} catch (err) {
  if (err.code !== 'EEXIST')
    logger.warn(err)
}

function sanitizeFileName(f) {
  return f.replace(/[^A-Za-z0-9_.]/, '_')
}

module.exports = router

router.use(secure.https, secure.auth)

router.get('/', (req, res, next) => {
  fs.readdir(DIR, (err, files) => {
    if (err)
      return next(err)
    res.json(files)
  })
})

// the argument to upload.array should match the name on the html input
router.post('/', upload.array('files'), (req, res, next) => {
  const result = []
  req.files.forEach(f => result.push({ name: f.filename, bytes: f.size, }))
  res.json(result)
})
