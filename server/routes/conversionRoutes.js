const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');
const { convertDeweyToLcc } = require('../utils/conversionUtils');

router.post('/ddc-to-lcc', conversionController.convertDdcToLcc);
router.post('/upload-mappings', conversionController.uploadMappings);
router.post('/convert', conversionController.convertClassification);

// Route to handle conversion
router.get('/convert/extd', (req, res) => {
	const dewey = req.query.dewey;
	if (!dewey) {
		return res.status(400).send('Please provide a Dewey Decimal Classification.');
	}
	const lcc = convertDeweyToLcc(dewey);
	res.send({ dewey, lcc });
});
module.exports = router;
