const router = require('express').Router()
const Menu = require('../models/menu')
const bodyParser = require('body-parser')

module.exports = router

router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res, next) => {
  Menu.findOne()
    .populate('categories')
    .exec((err, menu) => {
      if (err)
        return next(err)
      if (!menu) {
        res.status(404)
        return next(new Error('Not found'))
      }
      res.json(menu)
    })
})

router.put('/', (req, res, next) => {
  Menu.findOne({}, (err, menu) => {
    if (err)
      return next(err)

    var m = {
      name: req.body.name,
      categories: req.body.categories ? req.body.categories.split(',') : [],
    }

    function saveCallback(err, menu) {
      if (err)
        return next(err)
      res.json(menu)
    }

    if (!menu) {
      // create it if it doesn't exist yet
      Menu.create(m, saveCallback)
    } else {
      Object.assign(menu, m)
      menu.save(saveCallback)
    }
  })
})
