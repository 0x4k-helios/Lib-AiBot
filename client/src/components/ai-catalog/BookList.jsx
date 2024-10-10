import { useState } from "react";
import BookDetails from "./BookDetails";

// BookList component to display a list of books with pagination
const BookList = ({ books, totalResults, onCatalog }) => {
  // State to manage the number of displayed books
  const [displayedBooks, setDisplayedBooks] = useState(5);

  // Function to show more books
  const showMore = () => {
    setDisplayedBooks((prev) => Math.min(prev + 10, books.length));
  };

  return (
    <div>
      {/* Display the list of books */}
      {books.slice(0, displayedBooks).map((book, index) => (
        <BookDetails key={index} book={book} onCatalog={onCatalog} />
      ))}
      {/* Show "Show More" button if there are more books to display */}
      {displayedBooks < books.length && (
        <button
          onClick={showMore}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Show More
        </button>
      )}
      {/* Display the number of results shown */}
      <p className="mt-2 text-sm text-gray-600">
        Showing {Math.min(displayedBooks, books.length)} of {totalResults}{" "}
        results
      </p>
    </div>
  );
};

export default BookList;
