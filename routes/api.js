const router = require('express').Router();

module.exports = router;

router.use('/menu', require('./menu'));
router.use('/categories', require('./categories'));
router.use('/items', require('./items'));
router.use('/feedback', require('./feedback'));
router.use('/upload', require('./upload'));
router.use('/', require('../middleware/404'));
router.use('/', require('../middleware/err-handler').forJson);
