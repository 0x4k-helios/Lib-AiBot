# LibMetaBot

LibMetaBot is a cutting-edge library management system that revolutionizes the cataloging and organization of library resources. It seamlessly blends traditional library science with advanced AI technology to provide an efficient, accurate, and user-friendly experience for librarians and researchers alike.

## Features

- **Manual Cataloging**: Create and edit detailed bibliographic records with ease.
- **AI-Assisted Cataloging**: Harness the power of NLP to streamline and enhance the cataloging process.
- **Classification Tools**: Effortlessly work with both Dewey Decimal (DDC) and Library of Congress (LCC) classification systems.
- **Index Management**: Efficiently create and manage subject headings and indexes.
- **Authority Control**: Ensure consistency across your catalog with advanced metadata extraction and validation.
- **Intuitive User Interface**: Navigate through a sleek, React-based frontend designed for optimal productivity.

## Project Structure

The project is composed of two main components:

- `client/`: React-based frontend application
- `server/`: Node.js/Express backend server

## Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn
- MongoDB

## Quick Start

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/libmetabot.git
   cd libmetabot
   ```

2. Set up the backend:

   ```
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. Set up the frontend:

   ```
   cd ../client
   npm install
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to access the LibMetaBot interface.

For detailed setup instructions and configuration options, please refer to the documentation in the `client` and `server` directories.

## Key Features in Detail

- **AI-Assisted Cataloging**: Engage with our advanced NLP-powered chatbot to streamline the cataloging process. The AI assistant can help with various library management tasks beyond just cataloging.

- **Classification Tools**: Generate both DDC and LCC codes simultaneously from a book's ISBN. Our system includes automatic checks to prevent redundant classifications.

- **Index Management**: Manage DDC mappings and generate subject headings with ease. The system provides checks to prevent duplicate entries and offers generation summaries.

- **Authority Control**: Extract and validate metadata from bibliographic records, currently supporting JSON output. Our validation process ensures data quality and consistency.

## Acknowledgments

- OpenLibrary API
- Google Books API
- Google Generative AI

LibMetaBot: Empowering libraries with intelligent cataloging and management solutions.
