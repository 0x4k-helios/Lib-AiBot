import React, { useState } from "react";
import axios from "axios";
import CatalogingForm from "./CatalogingForm";
import BookSuggestion from "./BookSuggestion"; // Import the new component

const Chat = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [catalogData, setCatalogData] = useState(null);
  const [action, setAction] = useState("query");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const newMessage = { type: "user", content: query, suggestions: [] };
    setMessages((prev) => [...prev, newMessage]);

    try {
      let res;
      let url;

      if (action === "query") {
        url = `http://localhost:3000/query`; // Update endpoint if needed
        res = await axios.post(
          url,
          { query },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );
      } else if (action === "fetch-suggestions") {
        url = `http://localhost:3000/fetch-and-suggest`; // Update endpoint if needed
        res = await axios.post(
          url,
          { query },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );
      }

      const responseData = res.data;

      if (responseData.books) {
        // Update messages with book data
        const aiMessage = {
          type: "ai",
          content: "Here are the details of the book(s):",
        };
        setMessages((prev) => [...prev, aiMessage]);

        const bookMessages = responseData.books.map((book, index) => ({
          type: "ai",
          content: (
            <div key={index}>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p>
                <strong>Authors:</strong> {book.authors?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Published Date:</strong> {book.publish_date || "N/A"}
              </p>
              <p>
                <strong>Description:</strong> {book.description || "N/A"}
              </p>
              <p>
                <strong>Pages:</strong> {book.pages || "N/A"}
              </p>
              <p>
                <strong>Classification:</strong>{" "}
                {JSON.stringify(book.classification) || "N/A"}
              </p>
              <p>
                <strong>Source:</strong> {book.source}
              </p>
            </div>
          ),
        }));

        setMessages((prev) => [...prev, ...bookMessages]);
      } else if (responseData.suggestions) {
        // If suggestions are returned, update the suggestions in the last user message
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].suggestions =
            responseData.suggestions;
          return updatedMessages;
        });
      } else {
        const aiMessage = {
          type: "ai",
          content:
            responseData.message || JSON.stringify(responseData, null, 2),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }

      if (responseData.action === "fetch_metadata") {
        setCatalogData(responseData);
      }
    } catch (error) {
      console.error("Error processing request:", error.message);
      const errorMessage = {
        type: "error",
        content: "Error processing request: " + error.message,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="mb-32 flex h-dvh flex-col rounded-md bg-gray-200 dark:bg-gray-800">
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mx-auto max-w-2xl ${message.type === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block rounded-lg p-2 ${message.type === "user" ? "bg-blue-500 text-white" : message.type === "ai" ? "bg-gray-300 text-black dark:bg-gray-700 dark:text-white" : "bg-red-500 text-white"}`}
            >
              {typeof message.content === "string"
                ? message.content
                : message.content}
            </div>
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-2 text-left">
                <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
                  <h2 className="mb-2 text-lg font-semibold">
                    Book Suggestions:
                  </h2>
                  {message.suggestions.map((book, index) => (
                    <BookSuggestion key={index} suggestion={book} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="mx-auto max-w-2xl text-left">
            <div className="inline-block rounded-lg bg-gray-300 p-2 text-black dark:bg-gray-700 dark:text-white">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-4 right-4 rounded-xl border border-gray-300 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="mb-2 flex flex-col gap-2 md:flex-row">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={action === "query"}
                onChange={() => setAction("query")}
                className="mr-2 h-5 w-5 rounded-lg border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-blue-500"
              />
              Query
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={action === "fetch-suggestions"}
                onChange={() => setAction("fetch-suggestions")}
                className="mr-2 h-5 w-5 rounded-lg border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-blue-500"
              />
              Fetch Suggestions
            </label>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {catalogData && (
        <div className="fixed bottom-16 left-0 right-0 border-t border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold">Catalog Data:</h2>
          <pre className="overflow-x-auto rounded bg-gray-100 p-2 dark:bg-gray-800">
            <CatalogingForm data={catalogData} />
          </pre>
        </div>
      )}
    </div>
  );
};

export default Chat;
