var router = require('express').Router();

var commonCtrl = require('./common.controller');

router.post('/getMapper', commonCtrl.getAllMapper);
router.get('/getMapper/2', commonCtrl.getAllMapper2);
router.get('/getteam', commonCtrl.getAboutusDetail);

module.exports = router