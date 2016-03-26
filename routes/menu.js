const router = require('express').Router()
const Menu = require('../models/menu')

module.exports = router

router.get('/', (req, res, next) => {
  Menu.findOne()
    .populate('categories')
    .exec((err, menu) => {
      if (err)
        return next(err)
      res.json(menu)
    })
})
