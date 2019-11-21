var router = require('express').Router();
var auth = require('../../auth/auth.service');

var userCtrl = require('./user.controller');

router.get('/', auth.isAuthenticated(), userCtrl.getOwnProfile)
router.get('/user/all', userCtrl.getAll)
router.post('/register', userCtrl.register_new_user)
router.post('/verifyOtp', userCtrl.verify_otp)
router.post('/getAllUser', userCtrl.index)
router.post('/create', userCtrl.create)

module.exports = router