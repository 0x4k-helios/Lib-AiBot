import { useState } from "react";
import Chat from "../components/AICatalog/Chat";
import BreadcrumbNav from "../components/ui/BreadCrumbNav";
import { Database, Search } from "lucide-react";
import PageTitle from "../PageTitle";

// AICatalog component to provide an AI-assisted book cataloging interface
const AICatalog = () => {
  // State to manage the current query
  const [query, setQuery] = useState("");

  // List of prompt suggestions for the user
  const promptSuggestions = [
    "Find information about the book 'To Kill a Mockingbird' by Harper Lee",
    "Search for books by Gabriel García Márquez",
    "Get details for the novel '1984' by George Orwell",
    "Find books in the Harry Potter series",
    "Look up information on 'The Great Gatsby' by F. Scott Fitzgerald",
    "Search for books by Jane Austen",
    "Find information about 'The Catcher in the Rye' by J.D. Salinger",
    "Get details for 'Pride and Prejudice'",
    "Search for books by Stephen King",
    "Find information about 'The Hobbit' by J.R.R. Tolkien",
    "Get details for 'Brave New World' by Aldous Huxley",
    "Search for books in the Lord of the Rings series",
    "Find information about 'The Chronicles of Narnia'",
    "Get details for 'Fahrenheit 451' by Ray Bradbury",
    "Search for books by Agatha Christie",
  ];

  // Function to get random suggestions from the list
  const getRandomSuggestions = (count = 6) => {
    return [...promptSuggestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  };

  // Get a set of random suggestions to display
  const displayedSuggestions = getRandomSuggestions();

  // Handle click on a suggestion to set it as the current query
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6 dark:from-gray-900 dark:to-gray-800 dark:text-white sm:py-12">
      <PageTitle title="AI Catalog" />
      <div className="container mx-auto max-w-6xl">
        <BreadcrumbNav />
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-2 dark:bg-blue-900">
            <Database className="h-8 w-8 text-blue-500 dark:text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            AI-Assisted Book Catalog
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Search, find, and catalog books with our AI assistant
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Try These Searches
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Beta
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {displayedSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-lg dark:bg-gray-800">
          <Chat initialQuery={query} onQueryChange={setQuery} />
        </div>
      </div>
    </section>
  );
};

export default AICatalog;
