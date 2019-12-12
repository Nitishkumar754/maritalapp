var router = require('express').Router()
var auth = require('../../auth/auth.service');
var paymentintentCtrl = require('./paymentintent.controller')

// router.get('/:id', profileCtrl.getProfile)
// router.get('/all', paymentintentCtrl.getAll);
// router.get('/:id',auth.isAuthenticated(), paymentintentCtrl.getSusbciption);
router.post('/create', paymentintentCtrl.create_payment_intent);
// router.post('/update', auth.isAuthenticated(), paymentintentCtrl.updateSubscription);


module.exports = router