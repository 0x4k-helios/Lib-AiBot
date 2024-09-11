# LibCatalog

LibCatalog is a modern, comprehensive library management system that combines traditional cataloging methods with AI-assisted features to streamline the process of organizing and managing library resources.

## Features

- **Manual Cataloging**: Create and edit bibliographic records manually.
- **AI-Assisted Cataloging**: Leverage AI to automate and enhance the cataloging process.
- **Classification Tools**: Work with Dewey Decimal (DDC) and Library of Congress (LCC) systems.
- **Index Management**: Create and manage subject headings and indexes.
- **Authority Control**: Ensure consistency across your catalog.
- **User-Friendly Interface**: Easy-to-use React-based frontend for efficient library management.

## Project Structure

The project is divided into two main parts:

- `client/`: React-based frontend application
- `server/`: Node.js/Express backend server

## Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn
- MongoDB

## Quick Start

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/libcatalog.git
   cd libcatalog
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

4. Open your browser and navigate to `http://localhost:3000` for backend and `http://localhost:5173` for frontend to use LibCatalog.

For detailed setup instructions and configuration options, please refer to the documentation in the `client` and `server` directories.

## Acknowledgments

- OpenLibrary API
- Google Books API
- Google Generative AI
