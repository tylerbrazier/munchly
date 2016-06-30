const DIR = __dirname + '/../local/web'
const router = require('express').Router()
const secure = require('../middleware/secure')
const fs = require('fs')
const multer = require('multer')
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, DIR),
    filename: (req, file, cb) => cb(null, file.originalname),
  })
})

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
