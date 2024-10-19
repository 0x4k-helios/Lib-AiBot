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
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function generateResponseWithGemini(query, bookData) {
	try {
		const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		// Convert book data to a readable format
		const book1Data = JSON.stringify(bookData.docs[0], null, 2); // Pretty-print book1 data for the AI's reference
		const book2Data = JSON.stringify(bookData.docs[1], null, 2); // Pretty-print book2 data

		const prompt = `${query} 
		Use the following data to classify the book concisely. Focus only on providing essential information. Keep the response brief and avoid unnecessary details.
		
		Book 1: ${book1Data}
		Book 2: ${book2Data}
		
		Generate a clear and precise classification based on the query and the provided book data.`;
		// Generate the content using Gemini
		const response = await geminiModel.generateContent(prompt);

		// Log full response for debugging
		console.log('Full Gemini Response:', response);

		// Extract the response text from the candidates array
		let finalResponse = 'No response text available';
		if (response?.response?.candidates && response.response.candidates.length > 0) {
			const parts = response.response.candidates[0]?.content?.parts;
			if (parts && parts.length > 0) {
				finalResponse = parts[0].text || 'No response text available';
			}
		}

		// Log final response for debugging
		console.log('Final Response:', finalResponse);

		return { message: finalResponse };
	} catch (error) {
		console.error('Error generating response with Gemini:', error.message);
		throw error; // Propagate error
	}
}

app.post('/query', async (req, res) => {
	const { query } = req.body;

	try {
		// Get the AI-generated response to determine the action
		const aiResponse = await generateResponse(query);
		console.log('AI Response:', aiResponse);

		let searchResults = {};
		let userMessage = '';

		if (aiResponse.action === 'fetch_book_info') {
			const { title, author, isbn, classification } = aiResponse.parameters;

			// Construct query parameters for Open Library API
			let queryParams = new URLSearchParams();
			if (isbn) queryParams.append('q', `isbn:${isbn}`);
			if (title) queryParams.append('title', title);
			if (author) queryParams.append('author', author);
			if (classification) queryParams.append('subject', classification);
			if (aiResponse.parameters.page) queryParams.append('page', aiResponse.parameters.page);
			if (aiResponse.parameters.sort) queryParams.append('sort', aiResponse.parameters.sort);

			// Construct Open Library API URL
			const openLibraryApiUrl = `https://openlibrary.org/search.json?${queryParams.toString()}`;
			console.log('Open Library API URL:', openLibraryApiUrl);

			let response = await axios.get(openLibraryApiUrl);
			let openLibraryData = response.data;

			// Debug log for Open Library API response
			console.log('Open Library API Response:', openLibraryData);

			// Check if Open Library response is empty and fallback to Google Books API
			if (openLibraryData.num_found === 0 && isbn) {
				// Construct Google Books API URL
				const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
				console.log('Google Books API URL:', googleBooksApiUrl);

				response = await axios.get(googleBooksApiUrl);
				const googleBooksData = response.data;

				// Debug log for Google Books API response
				console.log('Google Books API Response:', googleBooksData);

				if (googleBooksData.items && googleBooksData.items.length > 0) {
					// Format Google Books data
					openLibraryData = {
						num_found: googleBooksData.items.length,
						docs: googleBooksData.items.map((item) => ({
							key: item.id,
							title: item.volumeInfo.title || '',
							author_name: item.volumeInfo.authors || [],
							cover_i: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
							first_publish_year: item.volumeInfo.publishedDate ? new Date(item.volumeInfo.publishedDate).getFullYear() : '',
							ia: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers.map((id) => id.identifier) : [],
						})),
					};
				}
			}

			// Generate a conversational response with Gemini
			console.log('Calling the function to be processed');
			const geminiResponse = await generateResponseWithGemini(query, openLibraryData);
			userMessage = geminiResponse.message;

			searchResults = {
				action: 'search_books',
				message: userMessage,
				data: openLibraryData, // Send all data returned from Open Library
			};
		} else if (aiResponse.action === 'convert_ddc') {
			// Logic for converting DDC
			const bookTitle = aiResponse.parameters?.title || '';

			if (!bookTitle) {
				return res.json({ error: 'No book title provided for conversion.' });
			}

			const searchUrl = `https://directory.doabooks.org/rest/search?query=dc.title:%22${encodeURIComponent(bookTitle)}%22&expand=metadata`;

			try {
				const response = await axios.get(searchUrl, { headers: { Accept: 'application/json' } });
				const books = response.data;
				if (books.length > 0) {
					userMessage = `Here are the results for the DDC conversion of the book titled "${bookTitle}".`;
					searchResults = { action: 'search_books', books };
				} else {
					userMessage = `No books were found for the DDC conversion of "${bookTitle}".`;
					searchResults = { action: 'search_books', message: 'No books found.' };
				}
			} catch (error) {
				console.error('Error converting DDC:', error);
				return res.json({ error: 'An error occurred while converting DDC.' });
			}
		} else if (aiResponse.action === 'general_response') {
			// Return the general response
			return res.json({ action: 'general_response', response: aiResponse.response });
		} else {
			return res.status(400).json({ error: 'Invalid action specified.' });
		}

		// Return the final response with conversational message and search results
		return res.json({ userMessage, ...searchResults });
	} catch (error) {
		console.error('Error processing query:', error.message);
		res.status(500).json({ error: 'An error occurred while processing the query.' });
	}
});

async function generateResponse(query) {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		console.log('This is your query:', query);

		// Refined prompt to better classify queries
		const prompt = `Analyze the following user query and determine the appropriate action. The query might be about a book.
	  If the query relates to book information (such as fetching details about a book) or converting a Dewey Decimal Classification (DDC) code, respond with a JSON object specifying the action: 'fetch_book_info' or 'convert_ddc'. Include any relevant parameters such as book title, author, or ISBN in the response. 
	  If the query does not fit these actions, provide a general informative response.
  
	  Examples:
	  - "Find details about the book 'The Girl with the Dragon Tattoo'"
	  - "Convert the DDC code '823.912' to LCC"
	  
	  Query: "${query}"`;

		// Generate content based on the refined prompt
		const result = await model.generateContent(prompt);
		const responseText = await result.response.text();

		console.log('Generated Response:', responseText);

		const ProData = `Use the following data ${responseText} to to respond to this query:${query}`;
		console.log('Generated ProData:', ProData);
		const processed_data = await model.generateContent(ProData);

		console.log('THIS IS THE PROCESSED RESPONSE: ', processed_data);
		// Extract JSON from the response text
		const jsonStart = responseText.indexOf('{');
		const jsonEnd = responseText.lastIndexOf('}') + 1;

		if (jsonStart === -1 || jsonEnd === -1) {
			throw new Error('No valid JSON found in response');
		}

		const jsonString = responseText.substring(jsonStart, jsonEnd);

		// Parse the JSON response
		const aiResponse = JSON.parse(jsonString);
		console.log('AI Response One:', aiResponse);
		// Validate action
		const validActions = ['fetch_book_info']; //, 'convert_ddc'
		if (validActions.includes(aiResponse.action) && aiResponse.action !== 'null') {
			return {
				action: aiResponse.action,
				parameters: {
					title: aiResponse.title || '',
					author: aiResponse.author || '',
					isbn: aiResponse.isbn || '',
				},
			};
		} else {
			// If action is undefined, null, or invalid, generate a general response
			return generateGeneralResponse(query);
		}
	} catch (error) {
		console.error('Error generating content:', error.message);
		throw error; // Propagate error
	}
}

async function generateGeneralResponse(query) {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		// Generate an informative response based on the user query
		const prompt = `Generate an informative and helpful response to the following user query:
	  Query: "${query}"`;

		const result = await model.generateContent(prompt);
		const responseText = await result.response.text();

		console.log('Generated General Response:', responseText);

		return { action: 'general_response', response: responseText };
	} catch (error) {
		console.error('Error generating general response:', error.message);
		throw error;
	}
}

// Express route to fetch a specific book for the catalog. The function searches for the book and returned all fields found

// app.get('/create/catalog/:identifier', async (req, res) => {
// 	const { identifier } = req.params; // Extract the identifier from the route parameters

// 	if (!identifier) {
// 		return res.status(400).json({ error: 'Identifier is required' });
// 	}

// 	try {
// 		let openLibraryUrl = '';

// 		if (/^\d{10}(\d{3})?$/.test(identifier)) {
// 			openLibraryUrl = `https://openlibrary.org/search.json?isbn=${identifier}`;
// 		} else {
// 			return res.status(400).json({ error: ' ISBN is not a valid ISBN format' });
// 		}

// 		console.log('Link: ', openLibraryUrl);

// 		const response = await axios.get(openLibraryUrl);

// 		if (response.data) {
// 			res.json({
// 				message: 'Book data fetched successfully',
// 				bookData: response.data,
// 			});
// 		} else {
// 			res.status(404).json({ message: 'No book data found for the provided identifier' });
// 		}
// 	} catch (error) {
// 		console.error('Error fetching data from OpenLibrary:', error.message);
// 		res.status(500).json({ error: 'An error occurred while fetching data from OpenLibrary' });
// 	}
// });

app.post('/create/catalog/:identifier', async (req, res) => {
	const { identifier } = req.params;
	const bookData = req.body;

	if (!identifier) {
		return res.status(400).json({ error: 'Identifier is required' });
	}

	try {
		let openLibraryUrl = '';

		// Handle different identifier formats
		if (/^\d{10}(\d{3})?$/.test(identifier)) {
			// ISBN-10 or ISBN-13
			openLibraryUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${identifier}&format=json&jscmd=data`;
		} else if (/^OL\d+[WMK]$/.test(identifier)) {
			// OpenLibrary ID
			openLibraryUrl = `https://openlibrary.org/api/books?bibkeys=OLID:${identifier}&format=json&jscmd=data`;
		} else {
			return res.status(400).json({ error: 'Invalid identifier format' });
		}

		const response = await axios.get(openLibraryUrl);

		if (Object.keys(response.data).length === 0) {
			return res.status(404).json({ error: 'No book data found for the provided identifier' });
		}

		// Combine fetched data with user-provided data
		const combinedData = {
			...Object.values(response.data)[0],
			...bookData,
			identifier,
		};

		// Save to database (replace this with your actual database logic)
		// For example, if using MongoDB:
		// const savedBook = await Book.create(combinedData);

		res.json({
			success: true,
			message: 'Book cataloged successfully',
			book: combinedData,
		});
	} catch (error) {
		console.error('Error cataloging book:', error.message);
		res.status(500).json({ error: 'An error occurred while cataloging the book' });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
