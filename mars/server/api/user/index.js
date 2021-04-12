var router = require('express').Router();
var auth = require('../../auth/auth.service');

var userCtrl = require('./user.controller');

router.post('/sendmail', userCtrl.sendmail);
router.post('/', auth.isAuthenticated(), userCtrl.getOwnProfile)
router.get('/user/all',auth.isAuthenticated(), userCtrl.getAll)
router.post('/register', userCtrl.register_new_user)
// router.post('/verifyOtp', userCtrl.verify_otp)
router.post('/getAllUser',auth.hasRole('admin'), userCtrl.index)
router.post('/create', userCtrl.admin_create_user_account)
router.post('/update/:id', auth.isAuthenticated(),userCtrl.admin_update_user_profile)
router.get('/subscribe/data/:id',auth.isAuthenticated() ,userCtrl.get_data_for_subscribed_user)

router.get('/viewed/contacts/mine',auth.isAuthenticated() ,userCtrl.get_viewed_contacts_of_user)

router.post('/:id',auth.isAuthenticated(), userCtrl.get_user_profile_detail);
router.get('/email/confirmation/:link', userCtrl.verify_email);

router.post('/password/reset', userCtrl.generate_password_reset_link); 
router.post('/password/update/:link', userCtrl.update_password);
router.post('/email/verification', userCtrl.send_email_verification); 
router.get('/count/userStats', auth.hasRole('admin'), userCtrl.get_user_stats);

router.post('/verify/email', userCtrl.registration_otp_verification);
router.post('/resend/otp', userCtrl.resend_otp);

router.post('/update/password/otp', userCtrl.send_password_reset_otp)
router.post('/update/password/request', userCtrl.verify_otp_and_update_password);



module.exports = router