const bodyParser = require('body-parser')
const router = require('express').Router()
const Feedback = require('../models/feedback')

module.exports = router

router.use(bodyParser.urlencoded({ extended: true }))

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

