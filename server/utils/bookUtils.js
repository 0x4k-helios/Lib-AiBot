const axios = require('axios');

const fetchBookDetails_ = async (isbn) => {
    const openLibraryUrl = `http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    try {
        // Try to fetch from Open Library API
        const openLibraryResponse = await axios.get(openLibraryUrl);
        const openLibraryData = openLibraryResponse.data;
        if (openLibraryData[`ISBN:${isbn}`]) {
            return openLibraryData[`ISBN:${isbn}`].details;
        } else {
            // If Open Library API returns no data, fetch from Google Books API
            const googleBooksResponse = await axios.get(googleBooksUrl);
            const googleBooksData = googleBooksResponse.data;
            if (googleBooksData.totalItems > 0) {
                return googleBooksData.items[0].volumeInfo;
            } else {
                throw new Error('No data found for the given ISBN');
            }
        }
    } catch (error) {
        throw new Error(`Error fetching book details: ${error.message}`);
    }
};



const fetchBookDetail_s = async ({ title, author, isbn, classification }) => {
    const openLibraryUrl = `http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    try {
        // Try to fetch from Open Library API
        const openLibraryResponse = await axios.get(openLibraryUrl);
        const openLibraryData = openLibraryResponse.data;
        if (openLibraryData[`ISBN:${isbn}`]) {
            const details = openLibraryData[`ISBN:${isbn}`].details;
            return {
                title: details.title,
                authors: details.authors ? details.authors.map(author => author.name) : [],
                publishedDate: details.publish_date,
                description: details.description ? (typeof details.description === 'string' ? details.description : details.description.value) : '',
                pages: details.number_of_pages,
                classification: details.classifications
            };
        } else {
            // If Open Library API returns no data, fetch from Google Books API
            const googleBooksResponse = await axios.get(googleBooksUrl);
            const googleBooksData = googleBooksResponse.data;
            if (googleBooksData.totalItems > 0) {
                const volumeInfo = googleBooksData.items[0].volumeInfo;
                return console.log(volumeInfo)
                // return {
                //     title: volumeInfo.title,
                //     authors: volumeInfo.authors || [],
                //     publishedDate: volumeInfo.publishedDate,
                //     description: volumeInfo.description,
                //     pages: volumeInfo.pageCount,
                //     classification: volumeInfo.industryIdentifiers || []
                // };
            } else {
                throw new Error('No data found for the given ISBN');
            }
        }
    } catch (error) {
        throw new Error(`Error fetching book details: ${error.message}`);
    }
};


const fetchBookDetails = async ({ title, author, isbn, classification }) => {
    const openLibraryUrl = `http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    try {
        // Try to fetch from Open Library API
        const openLibraryResponse = await axios.get(openLibraryUrl);
        const openLibraryData = openLibraryResponse.data;
        
        if (openLibraryData[`ISBN:${isbn}`]) {
            const details = openLibraryData[`ISBN:${isbn}`].details;

            // Return details from Open Library
            return {
                source: 'Open Library',
                title: details.title,
                authors: details.authors ? details.authors.map(author => author.name) : [],
                publishedDate: details.publish_date,
                description: details.description ? (typeof details.description === 'string' ? details.description : details.description.value) : '',
                pages: details.number_of_pages,
                classification: details.classifications || {}
            };
        } else {
            // If Open Library API returns no data, fetch from Google Books API
            const googleBooksResponse = await axios.get(googleBooksUrl);
            const googleBooksData = googleBooksResponse.data;

            if (googleBooksData.totalItems > 0) {
                const volumeInfo = googleBooksData.items[0].volumeInfo;

                // Return details from Google Books
                return {
                    source: 'Google Books',
                    title: volumeInfo.title,
                    authors: volumeInfo.authors || [],
                    publishedDate: volumeInfo.publishedDate,
                    description: volumeInfo.description || '',
                    pages: volumeInfo.pageCount,
                    classification: volumeInfo.industryIdentifiers || []
                };
            } else {
                throw new Error('No data found for the given ISBN');
            }
        }
    } catch (error) {
        throw new Error(`Error fetching book details: ${error.message}`);
    }
};
module.exports = { fetchBookDetails };
