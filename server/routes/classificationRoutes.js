const express = require('express');
const router = express.Router();
const classificationController = require('../controllers/conversionController');

router.post('/classify', classificationController.classifyBibliographicRecord);

module.exports = router;
