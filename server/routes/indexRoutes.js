const express = require('express');
const router = express.Router();
const indexController = require('../controllers/conversionController');

router.post('/create', indexController.createIndex);

module.exports = router;
