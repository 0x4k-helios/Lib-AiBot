import { useState } from "react";

// BookDetails component to display detailed information about a book
const BookDetails = ({ book, onCatalog }) => {
  // State to manage the expanded view of book details
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to render the value of a book property
  const renderValue = (value) => {
    if (Array.isArray(value)) {
      // Return only the first item of the array
      return value[0] || "Unknown";
    } else if (typeof value === "object" && value !== null) {
      // Convert object to string
      return JSON.stringify(value);
    }
    // Return the value or "Unknown" if the value is falsy
    return value || "Unknown";
  };

  return (
    <div className="mb-3 rounded-lg border border-gray-300 bg-white p-4 last:mb-0 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start">
        {book.cover_i ? (
          // Display book cover image if available
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
            alt={book.title}
            className="mr-4 h-32 w-24 object-cover"
          />
        ) : (
          // Placeholder for books without a cover image
          <div className="mr-4 flex h-32 w-24 items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No Image
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {renderValue(book.title)}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Authors:</strong> {renderValue(book.author_name)}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>First Published:</strong>{" "}
            {renderValue(book.first_publish_year)}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>ISBN:</strong> {renderValue(book.isbn)}
          </p>
          {isExpanded && (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Publisher:</strong> {renderValue(book.publisher)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>LCC:</strong> {renderValue(book.lcc)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>DDC:</strong> {renderValue(book.ddc_sort || book.ddc)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Edition Count:</strong>{" "}
                {renderValue(book.edition_count)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>eBook Access:</strong> {renderValue(book.ebook_access)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Has Full Text:</strong>{" "}
                {book.has_fulltext ? "Yes" : "No"}
              </p>
            </>
          )}
          <div className="mt-2 flex space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
            <button
              onClick={() => onCatalog(book)}
              className="rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600"
            >
              Catalog This Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
