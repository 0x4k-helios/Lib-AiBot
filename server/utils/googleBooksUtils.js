const axios = require('axios');

// Fetch book metadata from Google Books API by Book ID
async function getBookMetadataById(bookId) {
	try {
		const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
		const response = await axios.get(url);

		// Extracting relevant metadata from the response
		const bookData = response.data.volumeInfo;

		return {
			title: bookData.title,
			authors: bookData.authors || [],
			publisher: bookData.publisher || 'Unknown',
			publishedDate: bookData.publishedDate || 'Unknown',
			categories: bookData.categories || [],
			pageCount: bookData.pageCount || 0,
			description: bookData.description || '',
			imageLinks: bookData.imageLinks || {},
		};
	} catch (error) {
		console.error('Error fetching book metadata:', error.message);
		throw new Error('Could not retrieve book metadata');
	}
}

module.exports = {
	getBookMetadataById,
};
