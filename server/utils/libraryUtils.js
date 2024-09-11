const axios = require('axios');

// Convert DDC to LCC (Dummy Implementation)
function convertDDCtoLCC(ddc) {
	// Implement your conversion logic here
	return 'Q'; // Example LCC
}

// Fetch Book Metadata from Google Books API
// async function getBookMetadata(query) {
// 	const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent('0307269752')}`;
// 	console.log(apiUrl);
// 	const response = await axios.get(apiUrl);

// 	if (response.data.items) {
// 		console.log(response.data.items);
// 		return response.data.items.map((item) => ({
// 			id: item.id,
// 			title: item.volumeInfo.title,
// 			authors: item.volumeInfo.authors,
// 			publisher: item.volumeInfo.publisher,
// 			publishedDate: item.volumeInfo.publishedDate,
// 			description: item.volumeInfo.description,
// 			categories: item.volumeInfo.categories,
// 			pageCount: item.volumeInfo.pageCount,
// 			imageLinks: item.volumeInfo.imageLinks,
// 		}));
// 	}
// 	throw new Error('No books found');
// }

// async function getBookMetadata({ title, author, isbn, classification }) {
// 	try {
// 	  // Build the search query dynamically based on the provided parameters
// 	  let searchQuery = '';

// 	  if (isbn) {
// 		searchQuery += `isbn:${isbn}`;
// 	  }
// 	  if (title) {
// 		searchQuery += `${searchQuery ? '+' : ''}intitle:${encodeURIComponent(title)}`;
// 	  }
// 	  if (author) {
// 		searchQuery += `${searchQuery ? '+' : ''}inauthor:${encodeURIComponent(author)}`;
// 	  }
// 	  if (classification) {
// 		searchQuery += `${searchQuery ? '+' : ''}subject:${encodeURIComponent(classification)}`;
// 	  }

// 	  if (!searchQuery) {
// 		throw new Error('No valid search parameters provided');
// 	  }

// 	  // Construct the API URL
// 	  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`;
// 	  console.log('API URL:', apiUrl);

// 	  // Fetch data from the Google Books API
// 	  const response = await axios.get(apiUrl);

// 	  // Check if there are results and map the response data
// 	  if (response.data.items) {
// 		return response.data.items.map((item) => ({
// 		  id: item.id,
// 		  title: item.volumeInfo.title,
// 		  authors: item.volumeInfo.authors,
// 		  publisher: item.volumeInfo.publisher,
// 		  publishedDate: item.volumeInfo.publishedDate,
// 		  description: item.volumeInfo.description,
// 		  categories: item.volumeInfo.categories,
// 		  pageCount: item.volumeInfo.pageCount,
// 		  imageLinks: item.volumeInfo.imageLinks,
// 		}));
// 	  } else {
// 		throw new Error('No books found');
// 	  }
// 	} catch (error) {
// 	  console.error('Error fetching book metadata:', error.message);
// 	  throw error;
// 	}
//   }

// Function to get book metadata using both Google Books API and Google Gemini
async function getBookMetadata({ title, author, isbn, classification }) {
	try {
		let query = '';

		// Build the query string based on provided parameters
		if (isbn) {
			query = `ISBN:${isbn}`;
		} else if (title) {
			query = `intitle:${title}`;
		} else if (author) {
			query = `inauthor:${author}`;
		} else if (classification) {
			query = `subject:${classification}`;
		}

		const booksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
		console.log('Books API URL:', booksApiUrl);

		// Fetch data from Google Books API
		const booksResponse = await axios.get(booksApiUrl);

		let books = [];
		if (booksResponse.data.items) {
			books = booksResponse.data.items.map((item) => ({
				id: item.id,
				title: item.volumeInfo.title,
				authors: item.volumeInfo.authors,
				publisher: item.volumeInfo.publisher,
				publishedDate: item.volumeInfo.publishedDate,
				description: item.volumeInfo.description,
				categories: item.volumeInfo.categories,
				pageCount: item.volumeInfo.pageCount,
				imageLinks: item.volumeInfo.imageLinks,
			}));
		} else {
			throw new Error('No books found in Google Books API');
		}

		// Optionally, use Google Gemini for additional processing or querying
		const geminiApiUrl = `https://gemini.googleapis.com/v1/search?query=${encodeURIComponent(query)}`;
		console.log('Gemini API URL:', geminiApiUrl);

		// Fetch additional data from Google Gemini API
		const geminiResponse = await axios.get(geminiApiUrl);
		if (geminiResponse.data.items) {
			// Optionally, process or merge the Gemini data with Google Books data
			// For example, you could integrate additional details or recommendations
			console.log('Gemini Data:', geminiResponse.data.items);
			// Combine or enhance the book data with Gemini data if needed
		}

		return books;
	} catch (error) {
		console.error('Error fetching book metadata:', error.message);
		throw error;
	}
}

// Fetch Specific Book Metadata by ID
async function getBookMetadataById(bookId) {
	const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
	const response = await axios.get(apiUrl);

	if (response.data) {
		return response.data.volumeInfo;
	}
	throw new Error('Book not found');
}

module.exports = { convertDDCtoLCC, getBookMetadata, getBookMetadataById };
