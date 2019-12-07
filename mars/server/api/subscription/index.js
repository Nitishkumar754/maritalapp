var router = require('express').Router()
var auth = require('../../auth/auth.service');
var subscriptionCtrl = require('./subscription.controller')

// router.get('/:id', profileCtrl.getProfile)
router.get('/all', subscriptionCtrl.getAll);
router.get('/:id',auth.isAuthenticated(), subscriptionCtrl.getSusbciption);
router.post('/create', subscriptionCtrl.addSubscription);
router.post('/update', auth.isAuthenticated(), subscriptionCtrl.updateSubscription);


module.exports = router