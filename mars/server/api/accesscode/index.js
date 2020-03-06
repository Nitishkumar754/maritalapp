'use strict';

var express = require('express');
var controller = require('./accesscode.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.post('/create', controller.create);
router.get('/list', controller.listaccesscode);
router.post('/deleteCode/:id', controller.deleteAccesscode);

module.exports = router;