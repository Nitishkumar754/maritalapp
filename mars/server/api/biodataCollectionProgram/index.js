const express = require("express");
const controller = require("./biodataCollectionProgram.controller");
const router = express.Router();
const multer = require("multer");
var auth = require("../../auth/auth.service");

const upload = multer({
  inMemory: true,
});

router.post("/uploadBiodata", upload.any(), controller.uploadBiodataApi);
router.get("/listBiodata", controller.listBiodataApi);
router.get("/campaignStatus", controller.getCampaignStatus);
router.post(
  "/listBiodataAdmin",
  auth.hasRole("admin"),
  controller.listBiodataAdminApi
);
router.post(
  "/getBiodata/:id",
  auth.hasRole("admin"),
  controller.getBiodataAdminApi
);

router.post(
  "/getBiodataImages/:id",
  auth.hasRole("admin"),
  controller.getBiodataImages
);

router.post(
  "/updateBiodataStatus/:id",
  auth.hasRole("admin"),
  controller.updateBiodataStatusAdminApi
);

module.exports = router;
