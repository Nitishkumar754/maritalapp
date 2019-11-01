var router = require('express').Router()

router.use('/user', require('./api/user'))
router.use('/profile', require('./api/profile'))


module.exports = router