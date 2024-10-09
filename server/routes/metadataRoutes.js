const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/conversionController');

router.post('/extract', metadataController.extractMetadata);
// router.post('/ensureQuality', metadataController.ensureQuality);
router.post('/validate', metadataController.validateMetadata);

module.exports = router;
