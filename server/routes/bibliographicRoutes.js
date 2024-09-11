const express = require('express');
const router = express.Router();
const bibliographicController = require('../controllers/conversionController');

router.post('/create', bibliographicController.createBibliographicRecord);
router.get('/:id', bibliographicController.getBibliographicRecord);
router.get('/', bibliographicController.getBibliographicRecords);

module.exports = router;
