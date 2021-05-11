var router = require('express').Router();

var commonCtrl = require('./common.controller');

router.get('/getMapper', commonCtrl.getAllMapper);
router.get('/getMapper/2', commonCtrl.getAllMapper2);

module.exports = router