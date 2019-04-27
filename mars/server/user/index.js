var router = require('express').Router()

var userCtrl = require('./user.controller')

router.get('/:id', userCtrl.getUser)
module.exports = router