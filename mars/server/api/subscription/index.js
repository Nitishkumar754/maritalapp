var router = require('express').Router()
var auth = require('../../auth/auth.service');
var subscriptionCtrl = require('./subscription.controller')

// router.get('/:id', profileCtrl.getProfile)
router.get('/all', auth.isAuthenticated(), subscriptionCtrl.getAll);

router.get('/admin/all', auth.isAuthenticated(), subscriptionCtrl.getAll);

router.get('/:id', auth.isAuthenticated(), subscriptionCtrl.getSusbciption);
router.post('/create',auth.hasRole('admin'), subscriptionCtrl.addSubscription);
router.post('/update', auth.hasRole('admin'), subscriptionCtrl.updateSubscription);
router.get('/delete/:id', auth.hasRole('admin'), subscriptionCtrl.deactivate_subscription);
router.get('/activate/:id', auth.hasRole('admin'), subscriptionCtrl.activate_subscription);


module.exports = router