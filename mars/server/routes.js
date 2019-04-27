var router = require('express').Router()

var userCtrl = require('./user/user.controller')
router.use('/users', require('./user'))


module.exports = router