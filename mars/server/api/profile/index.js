var router = require("express").Router();
var auth = require("../../auth/auth.service");
var profileCtrl = require("./controller");
const multer = require("multer");
const upload = multer({
  inMemory: true,
});
// router.get('/:id', profileCtrl.getProfile)
router.post("/all", auth.isAuthenticated(), profileCtrl.getAllProfiles);
router.post("/u/:id", auth.isAuthenticated(), profileCtrl.getProfile);
router.post("/image/upload", auth.isAuthenticated(), profileCtrl.image_upload);

router.post("/update", auth.isAuthenticated(), profileCtrl.update_user_profile);

router.post(
  "/search/regularsearch",
  auth.isAuthenticated(),
  profileCtrl.regular_search
);

router.post(
  "/get/viewedcontacts",
  auth.isAuthenticated(),
  profileCtrl.contact_viewed_by_me
);

router.get(
  "/p/interestedinme",
  auth.isAuthenticated(),
  profileCtrl.get_interested_in_me
);

router.post(
  "/p/shortlisted",
  auth.isAuthenticated(),
  profileCtrl.get_my_shortlisted
);

router.post(
  "/p/myinterest",
  auth.isAuthenticated(),
  profileCtrl.get_my_interest
);

router.post(
  "/p/profilevisitor",
  auth.isAuthenticated(),
  profileCtrl.who_viewed_my_profile
);

router.post("/shortlist/:id", auth.isAuthenticated(), profileCtrl.short_list);

router.post("/interest/:id", auth.isAuthenticated(), profileCtrl.send_interest);

router.post("/guest/search", profileCtrl.get_guest_requested_profile);

router.post("/getProfileShareLink/:id", profileCtrl.getProfileSharableLink);
router.post("/shared/:id", profileCtrl.getSharedProfileAPI);
// router.get('/search/most_dist', profileCtrl.most_dist);

router.post(
  "/getProfilePhotos",
  auth.isAuthenticated(),
  profileCtrl.list_user_profile_photo
);
router.post(
  "/guest/getProfilePhotos",
  profileCtrl.list_user_profile_photo_guest
);

router.post(
  "/deletePhoto",
  auth.isAuthenticated(),
  profileCtrl.delete_user_profile_photo
);

router.post(
  "/adminVerifyProfile",
  auth.hasRole("admin"),
  profileCtrl.adminApproveOrRejectAPI
);

router.post(
  "/admin/uploadImage",
  upload.any(),
  auth.hasRole("admin"),
  profileCtrl.uploadImageAPI
);
router.post(
  "/admin/deleteImage",
  auth.hasRole("admin"),
  profileCtrl.deleteImageAPI
);

module.exports = router;
