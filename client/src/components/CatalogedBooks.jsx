const CatalogedBooks = ({ catalogedBooks }) => {
  return (
    <div className="mb-32 h-64 w-full overflow-auto border-t border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:h-auto lg:w-1/3 lg:border-l">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
        Cataloged Books
      </h2>
      {catalogedBooks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No books cataloged yet.
        </p>
      ) : (
        <div className="space-y-4">
          {catalogedBooks.map((book, index) => (
            <div
              key={index}
              className="rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-800"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {book.title || "Untitled Book"}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(book).map(
                  ([key, value]) =>
                    key !== "title" && (
                      <div key={key} className="flex flex-col">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {Array.isArray(value) ? value[0] : value}
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
