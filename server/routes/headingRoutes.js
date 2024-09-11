const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');

router.get('/generate-headings', conversionController.getHeadings);
router.post('/generate-headings', conversionController.generateHeadings);
// router.delete('/generate-headings/:ddcCode', async (req, res) => {
// 	try {
//         const { ddcCode } = req.params;
//         const result = await Heading.deleteOne({ ddcCode });
//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: `DDC code ${ddcCode} not found.` });
//         }
//         res.status(200).json({ message: `DDC code ${ddcCode} deleted successfully.` });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });
router.delete('/generate-headings/:ddcCode', conversionController.deleteDdcCode);

module.exports = router;
