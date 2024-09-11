const express = require('express');
const router = express.Router();
const Catalog = require('../models/catalog'); // Assuming you have a Catalog model
const { getBookMetadataById } = require('../utils/googleBooksUtils'); // Assuming this utility is defined

router.post('/select-fields', async (req, res) => {
	// const bookId = 'keDwEAAAQBAJ'; // Use actual bookId if coming from req.body or req.params
	// Define the selected fields to be cataloged
	// const selectedFields = {
	// 	title: 'Clean Code',
	// 	authors: ['Robert C. Martin'],
	// 	publisher: 'Prentice Hall',
	// 	publishedDate: '2008-08-01',
	// 	categories: ['Programming', 'Software Engineering'],
	// 	pageCount: 464,
	// };

	const { bookId, selectedFields } = req.body; // Get the bookId and selectedFields from the request body

	// Check if bookId is provided
	if (!bookId) {
		return res.status(400).json({ message: 'Missing bookId' });
	}

	// Catalog book metadata based on selected fields
	try {
		// Fetch book metadata using Google Books API
		const bookData = await getBookMetadataById(bookId);

		// Prepare the data for cataloging based on selected fields
		const catalogData = {};
		Object.keys(selectedFields).forEach((field) => {
			if (bookData[field]) {
				catalogData[field] = bookData[field];
			}
		});

		// Create and save the catalog entry
		const newCatalog = new Catalog({ data: catalogData });
		await newCatalog.save();

		// Respond with success message and cataloged data
		res.json({ message: 'Book cataloged successfully', data: newCatalog });
	} catch (error) {
		// Handle any errors during the process
		res.status(500).json({ message: 'Error saving catalog data', error: error.message });
	}
});

module.exports = router;
