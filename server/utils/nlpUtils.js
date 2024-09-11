const axios = require('axios');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// GoogleGenerativeAI required config
const configuration = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

// Model initialization
const modelId = 'gemini-pro';
const model = configuration.getGenerativeModel({ model: modelId });

// These arrays are to maintain the history of the conversation
const conversationContext = [];
const currentMessages = [];

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function generateResponse(query) {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		// Define the prompt with clear instructions to include the action and parameters
		const prompt = `Analyze the following user query and determine the appropriate action between these two functions: 'fetch_book_info' or 'convert_ddc'. 
	  Respond with a JSON object in the format {"action": "fetch_book_info" or "convert_ddc", "parameters": {"title": "book title", "author": "author name", "isbn": "isbn", "classification": "classification"}}.
	  If the query does not fit these actions, respond to the original query: Query: "${query}"`;

		// Generate content based on the prompt
		const result = await model.generateContent(prompt);
		const responseText = await result.response.text();

		// Log the generated response
		console.log('Generated Response:', responseText);

		// Extract JSON from the response text
		const jsonStart = responseText.indexOf('{');
		const jsonEnd = responseText.lastIndexOf('}') + 1;

		if (jsonStart === -1 || jsonEnd === -1) {
			throw new Error('No valid JSON found in response');
		}

		const jsonString = responseText.substring(jsonStart, jsonEnd);

		// Parse the JSON response
		const aiResponse = JSON.parse(jsonString);

		// Ensure the response includes a valid action
		const validActions = ['fetch_book_info', 'convert_ddc'];
		if (!aiResponse.action || aiResponse.action === 'undefined' || !validActions.includes(aiResponse.action)) {
			// If action is undefined, generate a more general response based on the query
			return generateGeneralResponse(query);
		}

		return {
			action: aiResponse.action,
			parameters: {
				title: aiResponse.parameters?.title || '',
				author: aiResponse.parameters?.author || '',
				isbn: aiResponse.parameters?.isbn || '',
				classification: aiResponse.parameters?.classification || '',
			},
		};
	} catch (error) {
		console.error('Error generating content:', error.message);
		throw error; // Propagate error
	}
}

async function generateGeneralResponse(query) {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		// Broader prompt to generate an informative response based on the user query
		const prompt = `Generate an informative and helpful response to the following user query:
	  Query: "${query}"`;

		const result = await model.generateContent(prompt);
		const responseText = await result.response.text();

		console.log('Generated General Response:', responseText);

		// Return the AI-generated response tied to the user's query
		return { action: 'general_response', response: responseText };
	} catch (error) {
		console.error('Error generating general response:', error.message);
		throw error;
	}
}

// app.post('/query', async (req, res) => {
// 	try {
// 		const userQuery = req.body.query;

// 		// Store the original query in case the AI can't determine a valid action
// 		let originalQuery = userQuery;

// 		// Get the AI-generated response
// 		const aiResponse = await generateResponse(userQuery);

// 		console.log('AI Response:', aiResponse);

// 		if (aiResponse.action && aiResponse.action !== 'undefined') {
// 			if (aiResponse.action === 'fetch_book_info') {
// 				// Logic for fetching book information based on the response
// 				const { title, author, isbn, classification } = aiResponse.parameters;

// 				let queryString = '';
// 				if (isbn) queryString += `ISBN:${isbn}`;
// 				if (title) queryString += `&title=${encodeURIComponent(title)}`;
// 				if (author) queryString += `&author=${encodeURIComponent(author)}`;
// 				if (classification) queryString += `&subject=${encodeURIComponent(classification)}`;

// 				const apiUrl = `https://openlibrary.org/api/books?bibkeys=${queryString}&jscmd=details&format=json`;
// 				console.log('API URL:', apiUrl);

// 				const response = await axios.get(apiUrl);
// 				const openLibraryData = response.data;

// 				if (Object.keys(openLibraryData).length > 0) {
// 					const books = Object.keys(openLibraryData).map((key) => {
// 						const details = openLibraryData[key].details;
// 						return {
// 							source: 'Open Library',
// 							...details,
// 							authors: details.authors ? details.authors.map((author) => author.name) : [],
// 							classification: details.classifications || {},
// 						};
// 					});
// 					return res.json({ action: 'search_books', books });
// 				} else {
// 					return res.json({ action: 'search_books', message: 'No books found.' });
// 				}
// 			} else if (aiResponse.action === 'convert_ddc') {
// 				// Logic for converting DDC
// 				const bookTitle = aiResponse.parameters?.title || '';

// 				if (!bookTitle) {
// 					return res.json({ error: 'No book title provided for conversion.' });
// 				}

// 				const searchUrl = `https://directory.doabooks.org/rest/search?query=dc.title:%22${encodeURIComponent(bookTitle)}%22&expand=metadata`;

// 				axios
// 					.get(searchUrl, { headers: { Accept: 'application/json' } })
// 					.then((response) => {
// 						const books = response.data;
// 						if (books.length > 0) {
// 							return res.json({ action: 'search_books', books });
// 						} else {
// 							return res.json({ action: 'search_books', message: 'No books found.' });
// 						}
// 					})
// 					.catch((error) => {
// 						console.error('Error converting DDC:', error);
// 						return res.json({ error: 'An error occurred while converting DDC.' });
// 					});
// 			}
// 		} else {
// 			// Action is undefined or invalid, generate AI response to the original user query
// 			console.log('Action is undefined or invalid. Generating a response to the original query.');
// 			const aiGeneratedResponse = await generateGeneralResponse(originalQuery); // Use original query here
// 			return res.json({ aiGeneratedResponse });
// 		}
// 	} catch (error) {
// 		console.error('Error processing query:', error.message);
// 		res.status(500).json({ error: 'An error occurred while processing the query.' });
// 	}
// });
async function generateValidResponse(query) {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		// Broader prompt to generate an informative response based on user query
		const prompt = `Generate an informative response to the following query:
	  Query: "${query}"`;

		const result = await model.generateContent(prompt);
		const responseText = result.response.text();

		console.log('Generated Valid Response:', responseText);

		// Return the AI-generated response
		return { action: 'general_response', response: responseText };
	} catch (error) {
		console.error('Error generating valid response:', error.message);
		throw error;
	}
}

module.exports = { generateResponse, generateValidResponse };
