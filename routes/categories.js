const router = require('express').Router()
const Category = require('../models/category')

module.exports = router

router.get('/', (req, res, next) => {
  Category.find((err, categories) => {
    if (err)
      return next(err)
    res.json(categories)
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
