var router = require('express').Router()

router.use('/user', require('./api/user'))
router.use('/profile', require('./api/profile'))
router.use('/subscription', require('./api/subscription'))
router.use('/paymenttransaction', require('./api/paymenttransaction'))
router.use('/subscription/order', require('./api/subscription_order'))
router.use('/feedback', require('./api/feedback'))
router.use('/accesscode', require('./api/accesscode'))
router.use('/common', require('./api/common'))


module.exports = router