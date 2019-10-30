var router = require('express').Router()

router.use('/users', require('./user'))
router.use('/profile', require('./profile'))


module.exports = router