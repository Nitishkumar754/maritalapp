var router = require('express').Router()
var auth = require('../../auth/auth.service');
var profileCtrl = require('./controller')

// router.get('/:id', profileCtrl.getProfile)
router.get('/all', auth.isAuthenticated(), profileCtrl.getAll);
router.get('/:id',auth.isAuthenticated(), profileCtrl.getProfile);
router.get('/image/upload',auth.isAuthenticated(), profileCtrl.image_upload);


module.exports = router