const bodyParser = require('body-parser')
const router = require('express').Router()
const Feedback = require('../models/Feedback')
const secure = require('../middleware/secure')
const sort = require('../middleware/sort')

module.exports = router

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', secure.https, secure.auth)
router.get('/', sort(Feedback, 'item'), (req, res, next) => {
  Feedback.find()
    .sort(req.sort)
    .populate('item')
    .exec((err, feedbacks) => {
      if (err)
        return next(err)
      res.json(feedbacks)
    })
})

router.post('/', (req, res, next) => {
  Feedback.create({
    comment: req.body.comment,
    rating: req.body.rating,
    item: req.body.item,
  }, (err, feedback) => {
    if (err)
      return next(err)
    res.json(feedback)
  })
})

router.delete('/:id', secure.https, secure.auth)
router.delete('/:id', (req, res, next) => {
  Feedback.findByIdAndRemove(req.params.id, (err, feedback) => {
    if (err)
      return next(err)
    if (!feedback) {
      res.status(404)
      return next(new Error(`Feedback ${req.params.id} not found`))
    }
    res.json(feedback)
  })
})
