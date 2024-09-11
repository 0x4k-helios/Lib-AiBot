require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const conversionRoutes = require('./routes/conversionRoutes');
const headingRoutes = require('./routes/headingRoutes');
const bibliographicRoutes = require('./routes/bibliographicRoutes');
const classificationRoutes = require('./routes/classificationRoutes');
const subjectHeadingRoutes = require('./routes/subjectHeadingRoutes');
const indexRoutes = require('./routes/indexRoutes');
const dynamicCollectionRoutes = require('./routes/dynamicCollectionRoutes');
const metadataRoutes = require('./routes/metadataRoutes');
const bookRoutes = require('./routes/bookRoutes');
const catalogRouter = require('./routes/catalog');
const { generateResponse } = require('./utils/nlpUtils');
const { convertDDCtoLCC } = require('./utils/libraryUtils');
const axios = require('axios');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/conversion', conversionRoutes);
app.use('/headings', headingRoutes);
app.use('/bibliographic', bibliographicRoutes);
app.use('/classification', classificationRoutes);
app.use('/subjectHeading', subjectHeadingRoutes);
app.use('/index', indexRoutes);
app.use('/collection', dynamicCollectionRoutes);
app.use('/metadata', metadataRoutes);
app.use('/api', bookRoutes);
app.use('/catalog', catalogRouter);

// Route for Natural Language Queries
// app.post('/query', async (req, res) => {
// 	const { query } = req.body;
// 	console.log("THIS IS YOUR QUERY: ",query);
// 	try {
// 		// const aiResponse = await queryOpenAI(query);
// 		const aiResponse = await generateResponse();
// 		console.log('AI Response:', aiResponse); // Log the AI response for debugging

// 		// Process the AI response as per your logic
// 		const action = aiResponse.action;
// 		console.log(action); //
// 		let result;

// 		switch (action) {
// 			case 'convert_ddc':
// 				const ddc = aiResponse.ddc;
// 				if (!ddc) {
// 					throw new Error('DDC is undefined');
// 				}
// 				result = { ddc, lcc: convertDDCtoLCC(ddc) };
// 				break;

// 			case 'fetch_metadata':
// 				const isbn = aiResponse.isbn;
// 				if (!isbn) {
// 					throw new Error('ISBN is undefined');
// 				}
// 				result = await getBookMetadata(isbn);
// 				break;

// 			default:
// 				throw new Error('Unknown action');
// 		}

// 		res.json(result);
// 	} catch (error) {
// 		console.error('Error processing query:', error.message);
// 		res.status(500).json({ message: 'Error processing query', error: error.message });
// 	}
// });

// Route handler for book queries
/*
app.post('/query', async (req, res) => {
	try {
	  const userQuery = req.body.query;
  
	  // Get the AI-generated response
	  const aiResponse = await generateResponse(userQuery);
  
	  console.log('AI Response:', aiResponse);
  
	  if (aiResponse.action === 'fetch_book_info') {
		const { title, author, isbn, classification } = aiResponse.parameters;
  
		// Build Google Books API query string based on available parameters
		let queryString = '';
		if (title) queryString += `intitle:${title} `;
		if (author) queryString += `inauthor:${author} `;
		if (isbn) queryString += `isbn:${isbn} `;
		if (classification) queryString += `subject:${classification} `;
  
		const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(queryString.trim())}`;
		console.log('API URL:', apiUrl);
  
		// Fetch book metadata
		const response = await axios.get(apiUrl);
		// if (response.data.items) {
		//   const books = response.data.items.map((item) => ({
		// 	id: item.id,
		// 	title: item.volumeInfo.title,
		// 	authors: item.volumeInfo.authors,
		// 	publisher: item.volumeInfo.publisher,
		// 	publishedDate: item.volumeInfo.publishedDate,
		// 	description: item.volumeInfo.description,
		// 	categories: item.volumeInfo.categories,
		// 	pageCount: item.volumeInfo.pageCount,
		// 	imageLinks: item.volumeInfo.imageLinks,
		//   }));
		if (response.data.items) {
			const books = response.data.items.map((item) => ({
			  ...item
			}));
		  
			
			console.log('Books data:', books);
		  }
  
		
	  } else if (aiResponse.action === 'convert_ddc') {
			// Extract the query from the AI response
			const bookTitle = aiResponse.parameters?.title || '';
		  
			// Validate if the book title is provided
			if (!bookTitle) {
			  return res.json({ error: 'No book title provided for search.' });
			}
		  
			// DOAB API URL for searching books by title
			const searchUrl = `https://directory.doabooks.org/rest/search?query=dc.title:%22${encodeURIComponent(bookTitle)}%22&expand=metadata`;
		  
			// Fetch book information from the DOAB API
			axios.get(searchUrl, {
			  headers: {
				Accept: 'application/json',
			  }
			})
			.then(response => {
			  // Handle successful response
			  const books = response.data;
		  
			  if (books.length > 0) {
				return res.json({ action: 'search_books', books });
			  } else {
				return res.json({ action: 'search_books', message: 'No books found.' });
			  }
			})
			.catch(error => {
			  console.error('Error searching books:', error);
			  return res.json({ error: 'An error occurred while searching for books.' });
			});
		
	  } else {
		throw new Error('Invalid action');
	  }
	} catch (error) {
	  console.error('Error processing query:', error.message);
	  res.status(500).json({ error: error.message });
	}
  });
*/
app.post('/query', async (req, res) => {
	try {
		const userQuery = req.body.query;

		// Get the AI-generated response
		const aiResponse = await generateResponse(userQuery);

		console.log('AI Response:', aiResponse);

		if (aiResponse.action === 'fetch_book_info') {
			const { title, author, isbn, classification } = aiResponse.parameters;

			// Build Open Library API query string based on available parameters
			let queryString = '';
			if (isbn) queryString += `ISBN:${isbn}`;
			if (title) queryString += `&title=${encodeURIComponent(title)}`;
			if (author) queryString += `&author=${encodeURIComponent(author)}`;
			if (classification) queryString += `&subject=${encodeURIComponent(classification)}`;

			const apiUrl = `https://openlibrary.org/api/books?bibkeys=${queryString}&jscmd=details&format=json`;
			console.log('API URL:', apiUrl);

			// Fetch book metadata from Open Library
			const response = await axios.get(apiUrl);
			const openLibraryData = response.data;
			console.log('Open Library data:', openLibraryData);
			if (Object.keys(openLibraryData).length > 0) {
				const books = Object.keys(openLibraryData).map((key) => {
					const details = openLibraryData[key].details;
					return {
						source: 'Open Library',
						...details,
						authors: details.authors ? details.authors.map((author) => author.name) : [],
						classification: details.classifications || {},
					};
				});

				console.log('Books data:', books);
				return res.json({ action: 'search_books', books });
			} else {
				return res.json({ action: 'search_books', message: 'No books found.' });
			}
		} else if (aiResponse.action === 'convert_ddc') {
			// Extract the query from the AI response
			const bookTitle = aiResponse.parameters?.title || '';

			// Validate if the book title is provided
			if (!bookTitle) {
				return res.json({ error: 'No book title provided for search.' });
			}

			// DOAB API URL for searching books by title
			const searchUrl = `https://directory.doabooks.org/rest/search?query=dc.title:%22${encodeURIComponent(bookTitle)}%22&expand=metadata`;

			// Fetch book information from the DOAB API
			axios
				.get(searchUrl, {
					headers: {
						Accept: 'application/json',
					},
				})
				.then((response) => {
					// Handle successful response
					const books = response.data;

					if (books.length > 0) {
						return res.json({ action: 'search_books', books });
					} else {
						return res.json({ action: 'search_books', message: 'No books found.' });
					}
				})
				.catch((error) => {
					console.error('Error searching books:', error);
					return res.json({ error: 'An error occurred while searching for books.' });
				});
		} else {
			throw new Error('Invalid action');
		}
	} catch (error) {
		console.error('Error processing query:', error.message);
		res.status(500).json({ error: error.message });
	}
});

// Function to simulate AI response generation
async function generateResponseII(query) {
	// This is a placeholder. Replace it with your actual AI response generation logic.
	const extractedDetails = extractBookDetails(query);
	return {
		action: 'fetch_book_info',
		parameters: extractedDetails,
	};
}

// Function to extract book details from user query
function extractBookDetails(query) {
	const isbnRegex = /(?:ISBN[- ]?)?(\d{10}|\d{13})/;
	const authorRegex = /by\s+([A-Za-z\s]+)/i;

	const isbnMatch = query.match(isbnRegex);
	const authorMatch = query.match(authorRegex);

	return {
		isbn: isbnMatch ? isbnMatch[1] : null,
		author: authorMatch ? authorMatch[1].trim() : null,
	};
}

// Function to get book metadata based on user query
async function getBookMetadataII(userQuery) {
	try {
		// Generate AI response
		const aiResponse = await generateResponse(userQuery);

		console.log('AI Response:', aiResponse);

		if (aiResponse.action === 'fetch_book_info') {
			const { title, author, isbn, classification } = aiResponse.parameters;
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

			if (!query) {
				throw new Error('No valid query parameters found');
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

			return books;
		} else {
			throw new Error('Invalid action in AI response');
		}
	} catch (error) {
		console.error('Error fetching book metadata:', error.message);
		throw error;
	}
}

// Express route to handle fetch and suggest
app.post('/fetch-and-suggest', async (req, res) => {
	const { query } = req.body;
	try {
		const suggestions = await getBookMetadataII(query); // Fetch book suggestions
		res.json({ suggestions });
	} catch (error) {
		res.status(500).json({ message: 'Error fetching book metadata', error: error.message });
	}
});

// Functions for action cases
//   function convertDDCtoLCC(ddc) {
// 	// Implement conversion logic here
// 	return `Converted LCC for ${ddc}`;
//   }

//   async function getBookMetadata(isbn) {
// 	// Implement fetching book metadata here
// 	return { title: 'Example Book Title', author: 'Example Author' };
//   }

// Route for Fetching Book Suggestions
// app.post('/fetch-and-suggest', async (req, res) => {
// 	const { query } = req.body;
// 	// console.log('Query:', query); // Log the query
// 	// let query = 'convert this dewey decimal classification 	839.73/8 to LCC'; //'Help me find the title for this book 9780307269751'
// 	console.log(query);
// 	try {
// 		const suggestions = await getBookMetadata(query);
// 		res.json({ suggestions });
// 	} catch (error) {
// 		res.status(500).json({ message: 'Error fetching book metadata', error: error.message });
// 	}
// });

// const axios = require('axios');

const fetchBookDetails = async ({ title, author, isbn, classification }) => {
	const openLibraryUrl = `http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
	const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

	try {
		// Try to fetch from Open Library API
		const openLibraryResponse = await axios.get(openLibraryUrl);
		const openLibraryData = openLibraryResponse.data;

		if (openLibraryData[`ISBN:${isbn}`]) {
			const details = openLibraryData[`ISBN:${isbn}`].details;

			// Return all fields from Open Library
			return {
				source: 'Open Library',
				...details,
				authors: details.authors ? details.authors.map((author) => author.name) : [],
				classification: details.classifications || {},
			};
		} else {
			// If Open Library API returns no data, fetch from Google Books API
			const googleBooksResponse = await axios.get(googleBooksUrl);
			const googleBooksData = googleBooksResponse.data;

			if (googleBooksData.totalItems > 0) {
				const volumeInfo = googleBooksData.items[0].volumeInfo;

				// Return all fields from Google Books
				return {
					source: 'Google Books',
					...volumeInfo,
					industryIdentifiers: volumeInfo.industryIdentifiers || [],
					authors: volumeInfo.authors || [],
					description: volumeInfo.description || '',
				};
			} else {
				throw new Error('No data found for the given ISBN');
			}
		}
	} catch (error) {
		throw new Error(`Error fetching book details: ${error.message}`);
	}
};

// Example usage
// fetchBookDetails({ title: 'Example Title', author: 'Example Author', isbn: '9780131103627', classification: 'QA76.73.J38' })
//     .then(details => console.log(details))
//     .catch(error => console.error(error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
