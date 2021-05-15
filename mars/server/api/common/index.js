var router = require('express').Router();

var commonCtrl = require('./common.controller');

router.post('/getMapper', commonCtrl.getAllMapper);
router.get('/getMapper/2', commonCtrl.getAllMapper2);

module.exports = router