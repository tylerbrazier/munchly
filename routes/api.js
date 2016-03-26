const router = require('express').Router()

module.exports = router

router.use('/categories', require('./categories'))
router.use('/menu', require('./menu'))
