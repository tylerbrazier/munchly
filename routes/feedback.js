const bodyParser = require('body-parser')
const router = require('express').Router()
const Feedback = require('../models/Feedback')
const secure = require('../middleware/secure')

module.exports = router

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', secure.https, secure.auth)
router.get('/', (req, res, next) => {
  Feedback.find((err, feedbacks) => {
    if (err)
      return next(err)
    res.json(feedbacks)
  })
})

router.post('/', (req, res, next) => {
  Feedback.create({
    body: req.body.body,
    rating: req.body.rating,
    item: req.body.item,
  }, (err, feedback) => {
    if (err)
      return next(err)
    res.json(feedback)
  })
})
