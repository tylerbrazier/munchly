const express = require('express')
const router = express.Router()
const secure = require('../middleware/secure')

module.exports = router

router.use(secure.https, secure.auth)
router.use(express.static('../client/dist/admin'))
// redirect /admin to /admin/menu
router.use(/^\/$/, (req, res, next) => res.redirect('/admin/menu/') )
