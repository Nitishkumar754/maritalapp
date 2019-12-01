var router = require('express').Router();
var auth = require('../../auth/auth.service');

var userCtrl = require('./user.controller');

router.get('/', auth.isAuthenticated(), userCtrl.getOwnProfile)
router.get('/user/all', userCtrl.getAll)
router.post('/register', userCtrl.register_new_user)
router.post('/verifyOtp', userCtrl.verify_otp)
router.post('/getAllUser', userCtrl.index)
router.post('/create', userCtrl.admin_create_user_account)
router.post('/update/:id', userCtrl.admin_update_user_profile)

router.post('/:id', userCtrl.get_user_profile_detail)


module.exports = router