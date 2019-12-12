var router = require('express').Router()
var auth = require('../../auth/auth.service');
var paymentCtrl = require('./paymenttransaction.controller')

// router.get('/:id', profileCtrl.getProfile)
// router.get('/all', paymentintentCtrl.getAll);
// router.get('/:id',auth.isAuthenticated(), paymentintentCtrl.getSusbciption);
router.post('/create',auth.isAuthenticated(), paymentCtrl.create_payment_order);
router.post('/verify/payment', paymentCtrl.verify_razorpayment_order);
// router.post('/update', auth.isAuthenticated(), paymentintentCtrl.updateSubscription);


module.exports = router