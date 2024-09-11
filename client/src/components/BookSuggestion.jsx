const Suggestion = ({ suggestion }) => {
  return (
    <div className="mb-3 rounded-lg border border-gray-300 bg-white p-4 last:mb-0 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center">
        {suggestion.imageLinks?.thumbnail ? (
          <img
            src={suggestion.imageLinks.thumbnail}
            alt={suggestion.title}
            className="mr-4 h-full object-cover"
          />
        ) : (
          <div className="mr-4 flex h-20 w-16 items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No Image
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {suggestion.title || "No Title Available"}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Authors:</strong>{" "}
            {suggestion.authors?.join(", ") || "Unknown"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Published Date:</strong>{" "}
            {suggestion.publishedDate || "Unknown"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Publisher:</strong> {suggestion.publisher || "Unknown"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Categories:</strong> {suggestion.categories || "Unknown"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Page Count:</strong> {suggestion.pageCount || "Unknown"}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        <strong>Description:</strong>{" "}
        {suggestion.description || "No Description Available"}
      </p>
      {/* <div className="mt-4 border-t border-gray-300 pt-4"></div> */}
    </div>
  );
};

export default Suggestion;
