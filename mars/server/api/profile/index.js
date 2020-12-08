var router = require('express').Router()
var auth = require('../../auth/auth.service');
var profileCtrl = require('./controller')

// router.get('/:id', profileCtrl.getProfile)
router.post('/all', auth.isAuthenticated(), profileCtrl.getAll);
router.post('/u/:id',auth.isAuthenticated(), profileCtrl.getProfile);
router.post('/image/upload', auth.isAuthenticated(), profileCtrl.image_upload);

router.post('/update',auth.isAuthenticated(), profileCtrl.update_user_profile);

router.post('/search/regularsearch' ,auth.isAuthenticated(), profileCtrl.regular_search);

router.get('/get/viewedcontacts' ,auth.isAuthenticated(), profileCtrl.contact_viewed_by_me);

router.get('/p/interestedinme', auth.isAuthenticated(), profileCtrl.get_interested_in_me);

router.get('/p/shortlisted', auth.isAuthenticated(), profileCtrl.get_my_shorlisted);


router.get('/p/myinterest' ,auth.isAuthenticated(), profileCtrl.get_my_interest);


router.get('/p/profilevisitor' ,auth.isAuthenticated(), profileCtrl.who_viewed_my_profile);

router.post('/shortlist/:id' ,auth.isAuthenticated(), profileCtrl.short_list);

router.post('/interest/:id' ,auth.isAuthenticated(), profileCtrl.send_interest);

router.post('/guest/search', profileCtrl.get_guest_requested_profile);

router.post('/getProfileShareLink/:id', profileCtrl.getProfileSharableLink);
router.post('/shared/:id', profileCtrl.getSharedProfileAPI);
// router.get('/search/most_dist', profileCtrl.most_dist);


module.exports = router