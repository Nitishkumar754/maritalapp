var router = require('express').Router();
var auth = require('../../auth/auth.service');

var userCtrl = require('./user.controller');

router.get('/', auth.isAuthenticated(), userCtrl.getOwnProfile)
router.get('/user/all',auth.isAuthenticated(), userCtrl.getAll)
router.post('/register', userCtrl.register_new_user)
router.post('/verifyOtp', userCtrl.verify_otp)
router.post('/getAllUser',auth.isAuthenticated(), userCtrl.index)
router.post('/create', userCtrl.admin_create_user_account)
router.post('/update/:id', auth.isAuthenticated(),userCtrl.admin_update_user_profile)
router.get('/subscribe/data/:id',auth.isAuthenticated() ,userCtrl.get_data_for_subscribed_user)

router.get('/viewed/contacts/mine',auth.isAuthenticated() ,userCtrl.get_viewed_contacts_of_user)

router.post('/:id',auth.isAuthenticated(), userCtrl.get_user_profile_detail)


module.exports = router