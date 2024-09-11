import React, { useState } from "react";
import Chat from "../components/Chat";
import BreadcrumbNav from "../components/BreadCrumbNav";
import { Database } from "lucide-react";
import PageTitle from "../PageTitle";

const AICatalog = () => {
  const [query, setQuery] = useState("");

  const promptSuggestions = [
    "Find information about the book 'The Great Gatsby' by F. Scott Fitzgerald",
    "Suggest books similar to 'To Kill a Mockingbird'",
    "Convert Dewey Decimal Classification 823.912 to Library of Congress Classification",
    "Find books by J.K. Rowling",
    "What's the Dewey Decimal classification for astronomy?",
  ];

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-2 py-6 dark:from-gray-900 dark:to-gray-800 dark:text-white sm:px-4 sm:py-12">
      <PageTitle title="AI Catalog" />
      <div className="container mx-auto max-w-6xl">
        <BreadcrumbNav />
        <div className="mb-4 flex flex-col items-center justify-center sm:mb-6 sm:flex-row">
          <Database className="mb-2 h-5 w-5 text-blue-500 sm:mb-0 sm:mr-2 sm:h-6 sm:w-6" />
          <h1 className="text-center text-xl font-semibold sm:text-2xl">
            Interact with the AI to catalog your books.
          </h1>
        </div>

        {/* Refined Beta Notice */}
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 shadow-sm dark:bg-blue-900 dark:text-blue-200 sm:px-3">
            AI Catalog Beta • This is a preview. May produce inaccurate results.
          </span>
        </div>

        <div className="mb-4 rounded-lg bg-slate-200 p-3 dark:bg-slate-700 sm:p-4">
          <h2 className="mb-2 text-base font-semibold sm:text-lg">
            Prompt Suggestions:
          </h2>
          <ul className="list-disc pl-4 text-sm sm:pl-5 sm:text-base">
            {promptSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="mb-1 cursor-pointer text-blue-600 hover:underline dark:text-blue-400 sm:mb-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        <Chat initialQuery={query} onQueryChange={setQuery} />
      </div>
    </section>
  );
};

export default AICatalog;
