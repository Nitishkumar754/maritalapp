var router = require('express').Router()
var auth = require('../../auth/auth.service');
var profileCtrl = require('./controller')

// router.get('/:id', profileCtrl.getProfile)
router.get('/all', auth.isAuthenticated(), profileCtrl.getAll);
router.get('/:id',auth.isAuthenticated(), profileCtrl.getProfile);
router.post('/image/upload', auth.isAuthenticated(), profileCtrl.image_upload);

router.post('/update',auth.isAuthenticated(), profileCtrl.update_user_profile);

router.post('/search/regularsearch' ,auth.isAuthenticated(), profileCtrl.regular_search);

router.get('/get/viewedcontacts' ,auth.isAuthenticated(), profileCtrl.get_viewed_contacts);


// router.get('/search/most_dist', profileCtrl.most_dist);


module.exports = router