var router = require('express').Router();
var auth = require('../../auth/auth.service');

var feedbackCtrl = require('./feedback.controller');

router.post('/postmessage', feedbackCtrl.post_feedback);
router.get('/getFeedback', auth.isAuthenticated(), feedbackCtrl.getFeedback);

module.exports = router