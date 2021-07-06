const express = require('express');
const controller = require('./biodataCollectionProgram.controller');
const router = express.Router();
const multer = require('multer');

const upload = multer({
  inMemory: true
});


router.post('/uploadBiodata', upload.any(), controller.uploadBiodataApi);
router.get('/listBiodata', controller.listBiodataApi);

module.exports = router;