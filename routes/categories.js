const router = require('express').Router()
const Category = require('../models/category')
const bodyParser = require('body-parser')

module.exports = router

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res, next) => {
  Category.find((err, categories) => {
    if (err)
      return next(err)
    res.json(categories)
  })
})

router.post('/', (req, res, next) => {
  Category.create({
    name: req.body.name,
    items: req.body.items ? req.body.items.split(',') : [],
  }, (err, category) => {
    if (err)
      return next(err)
    res.json(category)
  })
})

router.param('id', (req, res, next, id) => {
  Category.findOne({ _id: id })
    .populate('items')
    .exec((err, category) => {
      if (err)
        return next(err)
      if (!category) {
        res.status(404)
        return next(new Error(`Category ${id} not found`))
      }
      req.category = category
      next()
    })
})

router.get('/:id', (req, res, next) => {
  res.json(req.category)
})

router.put('/:id', (req, res, next) => {
  req.category.name = req.body.name
  req.category.items = req.body.items ? req.body.items.split(',') : []
  req.category.save((err, category, nUpdated) => {
    if (err)
      return next(err)
    res.json(category)
  })
})

router.delete('/:id', (req, res, next) => {
  req.category.remove((err, category) => {
    if (err)
      return next(err)
    res.json(category)
  })
})
