var router = require('express').Router()
var auth = require('../../auth/auth.service');
var paymentCtrl = require('./paymenttransaction.controller')

router.post('/all', paymentCtrl.get_all_payments);
// router.get('/all', paymentintentCtrl.getAll);
// router.get('/:id',auth.isAuthenticated(), paymentintentCtrl.getSusbciption);
router.post('/create',auth.isAuthenticated(), paymentCtrl.create_payment_order);
router.post('/verify/payment', paymentCtrl.verify_payment_and_place_order);
// router.post('/update', auth.isAuthenticated(), paymentintentCtrl.updateSubscription);


module.exports = router