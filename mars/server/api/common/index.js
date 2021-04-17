var router = require('express').Router();

var commonCtrl = require('./common.controller');

router.get('/getMapper', commonCtrl.getAllMapper);

module.exports = router