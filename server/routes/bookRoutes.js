const express = require('express');
const router = express.Router();
const bookController = require('../controllers/conversionController');

router.get('/book/:isbn', bookController.getBookDetails);

module.exports = router;
