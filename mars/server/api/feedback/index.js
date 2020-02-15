var router = require('express').Router();

var feedbackCtrl = require('./feedback.controller');

router.post('/postmessage', feedbackCtrl.post_feedback);

module.exports = router