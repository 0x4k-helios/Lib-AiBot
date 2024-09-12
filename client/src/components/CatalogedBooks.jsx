import { FaBook, FaInfoCircle } from "react-icons/fa";

const CatalogedBooks = ({ catalogedBooks }) => {
  return (
    <div className="h-64 w-full overflow-auto border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 lg:h-auto lg:w-1/3 lg:rounded-r-lg lg:border-l">
      <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800 dark:text-gray-200">
        <FaBook className="mr-2 text-blue-500" />
        Cataloged Books
      </h2>
      {catalogedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700">
          <FaInfoCircle className="mb-2 text-4xl text-gray-400 dark:text-gray-500" />
          <p className="text-gray-600 dark:text-gray-400">
            No books cataloged yet.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Catalog a book to see it appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {catalogedBooks.map((book, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-gray-700"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {book.title || "Untitled Book"}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(book).map(
                  ([key, value]) =>
                    key !== "title" && (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        <span className="mt-1 text-gray-800 dark:text-gray-200">
                          {Array.isArray(value) ? value[0] : value || "N/A"}
                        </span>
                      </div>
                    ),
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogedBooks;
