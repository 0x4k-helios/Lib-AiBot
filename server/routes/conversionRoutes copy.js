const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');

router.post('/ddc-to-lcc', conversionController.convertDdcToLcc);
router.post('/upload-mappings', conversionController.uploadMappings);

module.exports = router;
