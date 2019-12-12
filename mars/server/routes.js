var router = require('express').Router()

router.use('/user', require('./api/user'))
router.use('/profile', require('./api/profile'))
router.use('/subscription', require('./api/subscription'))
router.use('/paymenttransaction', require('./api/paymenttransaction'))


module.exports = router