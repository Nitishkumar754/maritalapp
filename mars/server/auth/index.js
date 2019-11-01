'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require ('../api/user/user.model');
var controller = require('./local/local.controller');
// Passport Configuration
// require('./local/passport').setup(User, config);
// require('./facebook/passport').setup(User, config);
// require('./google/passport').setup(User, config);
// require('./twitter/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));
// router.use('/facebook', require('./facebook'));
// router.use('/twitter', require('./twitter'));
// router.use('/google', require('./google'));

// router.post('/generateOTP/:mobile_number',controller.generateOTP);
// router.get('/registeredUser/:mobile_number',controller.checkRegisteredUser);
router.post('/login',controller.login);
// router.post('/guestLogin', controller.verifyGuestLogin);
module.exports  = router;
