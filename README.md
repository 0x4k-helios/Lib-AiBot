# LibCatalog

LibCatalog is a comprehensive library management system that combines traditional cataloging methods with AI-assisted features to streamline the process of organizing and managing library resources.

## Features

- **Manual Cataloging**: Create and edit bibliographic records manually, generate MARC21 data, and assign initial classifications.
- **AI-Assisted Cataloging**: Leverage AI to automatically generate bibliographic records, suggest classifications, and streamline the cataloging process.
- **Classification Tools**: Verify existing classifications or convert between Dewey Decimal (DDC) and Library of Congress (LCC) systems.
- **Index Management**: Create and manage subject headings, generate indexes for your catalog, and organize your collection.
- **Authority Control**: Manage authorized headings, extract and standardize metadata, and ensure consistency across your catalog.
- **Integration with Open Library and Google Books APIs**: Fetch and supplement book information from these extensive databases.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/libcatalog.git
   cd libcatalog
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:

   ```
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

   Replace `your_google_ai_api_key` and `your_mongodb_connection_string` with your actual Google AI API key and MongoDB connection string.

## Usage

To start the server:

```
npm start
```

The server will start running on `http://localhost:3000` (or the port specified in your .env file).

## API Endpoints

- `/query`: POST - Send queries for book information or classification conversion
- `/create/catalog/:identifier`: POST - Catalog a book using its identifier (ISBN or OpenLibrary ID)

For a full list of endpoints and their usage, please refer to the API documentation.

## Contributing

Contributions to LibCatalog are welcome! Please refer to the `CONTRIBUTING.md` file for guidelines.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgments

- OpenLibrary API
- Google Books API
- Google Generative AI

## Contact

If you have any questions or feedback, please open an issue on the GitHub repository.
