var router = require('express').Router()
var auth = require('../../auth/auth.service');
var subscriptionOrderCtrl = require('./subscription_order.controller')

router.get('/all', subscriptionOrderCtrl.get_all_subscription_orders);
router.get('/:id', auth.isAuthenticated(), subscriptionOrderCtrl.get_all_subscription_of_user);
// router.get('/', auth.isAuthenticated(), subscriptionOrderCtrl.get_all_subscription_of_user);
router.post('/create/promotional/order',auth.isAuthenticated(), subscriptionOrderCtrl.create_promotional_order);

module.exports = router