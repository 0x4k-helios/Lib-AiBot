const express = require('express');
const router = express.Router();
const dynamicCollectionController = require('../controllers/conversionController');

router.post('/create', dynamicCollectionController.createCollection);

router.post('/add-fields', dynamicCollectionController.addItem);

router.get('/all', dynamicCollectionController.getAllCollections);

module.exports = router;
