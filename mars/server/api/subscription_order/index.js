var router = require('express').Router()
var auth = require('../../auth/auth.service');
var subscriptionOrderCtrl = require('./subscription_order.controller')

router.get('/all', subscriptionOrderCtrl.get_all_subscription_orders);
router.get('/:id', auth.isAuthenticated(), subscriptionOrderCtrl.get_all_subscription_of_user);
// router.get('/', auth.isAuthenticated(), subscriptionOrderCtrl.get_all_subscription_of_user);

module.exports = router