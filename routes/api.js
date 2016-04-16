const router = require('express').Router()

module.exports = router

router.use('/categories', require('./categories'))
router.use('/menu', require('./menu'))
router.use('/feedback', require('./feedback'))
router.use('/', require('../middleware/404'))
router.use('/', require('../middleware/err-handler').forJson)
