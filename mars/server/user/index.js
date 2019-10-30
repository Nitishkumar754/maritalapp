var router = require('express').Router()

var userCtrl = require('./user.controller')

router.get('/:id', userCtrl.getUser)
router.get('/user/all', userCtrl.getAll)
router.post('/register', userCtrl.register_new_user)
router.post('/verifyOtp', userCtrl.verify_otp)

module.exports = router