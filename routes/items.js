const router = require('express').Router()
const Item = require('../models/Item')
const bodyParser = require('body-parser')
const secure = require('../middleware/secure')

module.exports = router

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res, next) => {
  Item.find((err, items) => {
    if (err)
      return next(err)
    res.json(items)
  })
})

router.post('/', secure.https, secure.auth)
router.post('/', create)

router.put('/', secure.https, secure.auth)
router.put('/', create)

function create(req, res, next) {
  Item.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  }, (err, item) => {
    if (err)
      return next(err)
    res.json(item)
  })
}

router.param('id', (req, res, next, id) => {
  Item.findOne({ _id: id }, (err, item) => {
    if (err)
      return next(err)
    if (!item) {
      res.status(404)
      return next(new Error(`Item ${id} not found`))
    }
    req.item = item
    next()
  })
})

router.get('/:id', (req, res, next) => {
  res.json(req.item)
})

router.put('/:id', secure.https, secure.auth)
router.put('/:id', (req, res, next) => {
  req.item.name = req.body.name
  req.item.description = req.body.description
  req.item.price = req.body.price
  req.item.image = req.body.image
  req.item.save((err, item, nUpdated) => {
    if (err)
      return next(err)
    res.json(item)
  })
})

router.delete('/:id', secure.https, secure.auth)
router.delete('/:id', (req, res, next) => {
  req.item.remove((err, item) => {
    if (err)
      return next(err)
    res.json(item)
  })
})
