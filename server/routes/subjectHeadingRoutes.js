const express = require('express');
const router = express.Router();
const subjectHeadingController = require('../controllers/conversionController');

router.post('/generate', subjectHeadingController.generateHeadingsAndKeywords);

module.exports = router;
