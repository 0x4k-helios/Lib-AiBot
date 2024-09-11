const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');

router.post('/generate-headings', conversionController.generateHeadings);

module.exports = router;
