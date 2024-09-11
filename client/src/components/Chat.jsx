import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaInfoCircle, FaBook, FaExclamationTriangle } from "react-icons/fa";
import CatalogedBooks from "./CatalogedBooks";
import api from "../utils/api";

const Chat = ({ initialQuery, onQueryChange }) => {
  const [query, setQuery] = useState(initialQuery || "");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [catalogingBook, setCatalogingBook] = useState(null);
  const [catalogedBooks, setCatalogedBooks] = useState([]);
  const chatContainerRef = useRef(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  const scrollToBottom = () => {
    if (chatContainerRef.current && shouldScrollRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100;
      shouldScrollRef.current = scrolledToBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const newMessage = { type: "user", content: query };
    setMessages((prev) => [...prev, newMessage]);
    shouldScrollRef.current = true;

    try {
      const response = await api.post("/query", { query });

      const responseData = response.data;
      console.log("Response Data:", responseData);

      switch (responseData.action) {
        case "general_response":
        case "informative":
          setMessages((prev) => [
            ...prev,
            {
              type: "ai",
              content: responseData.response,
              action: responseData.action,
            },
          ]);
          break;
        case "search_books":
          if (
            responseData.data &&
            responseData.data.docs &&
            responseData.data.docs.length > 0
          ) {
            setMessages((prev) => [
              ...prev,
              {
                type: "ai",
                content:
                  responseData.userMessage || "Here are the books I found:",
                action: "search_books",
              },
              {
                type: "book_list",
                content: responseData.data.docs,
                totalResults: responseData.data.numFound,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                type: "ai",
                content:
                  responseData.userMessage ||
                  "I couldn't find any books matching your query. Could you try rephrasing?",
                action: "search_books",
              },
            ]);
          }
          break;
        case "fetch_book_info":
          setMessages((prev) => [
            ...prev,
            {
              type: "ai",
              content:
                responseData.message ||
                "I'm not sure how to process this response. Could you try asking in a different way?",
              action: "fetch_book_info",
            },
          ]);
          break;
        default:
          setMessages((prev) => [
            ...prev,
            {
              type: "ai",
              content:
                "I'm not sure how to process this response. Could you try asking in a different way?",
              action: "unknown",
            },
          ]);
      }
    } catch (error) {
      console.error("Error processing request:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content:
            error.response?.data?.message ||
            "An error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setQuery("");
      onQueryChange(""); // Reset the query in the parent component
    }
  };

  const handleCatalog = (book) => {
    setCatalogingBook(book);
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="mb-4 flex flex-grow flex-col rounded-md bg-gray-100 dark:bg-gray-800 lg:mb-32">
        <div
          ref={chatContainerRef}
          className="flex-1 space-y-4 overflow-auto p-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mx-auto max-w-2xl ${
                message.type === "user" ? "text-right" : "text-left"
              }`}
            >
              <MessageContent message={message} onCatalog={handleCatalog} />
            </div>
          ))}
          {isLoading && (
            <div className="mx-auto max-w-2xl text-left">
              <div className="inline-block animate-pulse rounded-lg bg-gray-300 p-2 text-black dark:bg-gray-700 dark:text-white">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-4 right-4 rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onQueryChange(e.target.value);
                }}
                placeholder="Ask about a book or any library-related question..."
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
      </div>
      <CatalogedBooks catalogedBooks={catalogedBooks} />
      {catalogingBook && (
        <CatalogingPanel
          book={catalogingBook}
          onClose={() => setCatalogingBook(null)}
          onCatalogSuccess={(book) => {
            setCatalogedBooks((prev) => [...prev, book]);
            setCatalogingBook(null);
          }}
        />
      )}
    </div>
  );
};

const MessageContent = ({ message, onCatalog }) => {
  switch (message.type) {
    case "user":
      return (
        <div className="inline-block rounded-lg bg-blue-500 px-4 py-2 text-white">
          {message.content}
        </div>
      );
    case "ai":
      return (
        <div className="inline-block rounded-lg bg-white p-4 shadow-md dark:bg-gray-700 dark:text-white">
          {message.action === "informative" && (
            <FaInfoCircle className="mb-2 text-blue-500" />
          )}
          {message.action === "search_books" && (
            <FaBook className="mb-2 text-green-500" />
          )}
          <ReactMarkdown
            children={message.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
            className="markdown-body"
          />
        </div>
      );
    case "book_list":
      return (
        <BookList
          books={message.content}
          totalResults={message.totalResults}
          onCatalog={onCatalog}
        />
      );
    case "error":
      return (
        <div className="inline-block rounded-lg bg-red-200 p-4 text-red-700">
          <FaExclamationTriangle className="mb-2 text-red-500" />
          {message.content}
        </div>
      );
    default:
      return null;
  }
};

const BookList = ({ books, totalResults, onCatalog }) => {
  const [displayedBooks, setDisplayedBooks] = useState(10);

  const showMore = () => {
    setDisplayedBooks((prev) => Math.min(prev + 10, books.length));
  };

  return (
    <div>
      {books.slice(0, displayedBooks).map((book, index) => (
        <BookDetails key={index} book={book} onCatalog={onCatalog} />
      ))}
      {displayedBooks < books.length && (
        <button
          onClick={showMore}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Show More
        </button>
      )}
      <p className="mt-2 text-sm text-gray-600">
        Showing {Math.min(displayedBooks, books.length)} of {totalResults}{" "}
        results
      </p>
    </div>
  );
};

const BookDetails = ({ book, onCatalog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return value[0] || "Unknown"; // Return only the first item of the array
    } else if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value || "Unknown";
  };

  return (
    <div className="mb-3 rounded-lg border border-gray-300 bg-white p-4 last:mb-0 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start">
        {book.cover_i ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
            alt={book.title}
            className="mr-4 h-32 w-24 object-cover"
          />
        ) : (
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

const CatalogingPanel = ({ book, onClose, onCatalogSuccess }) => {
  const [checkedFields, setCheckedFields] = useState({
    title: true,
    author: true,
    publishYear: true,
    publisher: true,
    isbn: true,
    lcc: true,
    ddc: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleCheckboxChange = (e) => {
    setCheckedFields({ ...checkedFields, [e.target.name]: e.target.checked });
  };
  const getFieldValue = (field) => {
    const value =
      book[field] || book[field === "author" ? "author_name" : field];
    return Array.isArray(value) ? value[0] : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    if (Object.values(checkedFields).every((value) => !value)) {
      setMessage({
        type: "error",
        content: "Please select at least one field to catalog.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const identifier = getFieldValue("isbn") || book.key.split("/").pop();
      const dataToSubmit = Object.keys(checkedFields).reduce((acc, key) => {
        if (checkedFields[key]) {
          const value = getFieldValue(key);
          if (value) acc[key] = value;
        }
        return acc;
      }, {});

      if (Object.keys(dataToSubmit).length === 0) {
        setMessage({
          type: "error",
          content: "No valid data to catalog. Please check your selection.",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await api.post(
        `/create/catalog/${identifier}`,
        dataToSubmit,
      );
      if (response.data.success) {
        setMessage({
          type: "success",
          content: "Book cataloged successfully!",
        });
        setTimeout(() => {
          onCatalogSuccess(dataToSubmit);
        }, 1500);
      } else {
        setMessage({
          type: "error",
          content: "Failed to catalog book. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error cataloging book:", error);
      setMessage({
        type: "error",
        content: "An error occurred while cataloging the book.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold">Catalog Book</h2>
        {message.content && (
          <div
            className={`mb-4 rounded px-4 py-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {message.content}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries({
            title: "Title",
            author: "Author",
            publishYear: "Publish Year",
            publisher: "Publisher",
            isbn: "ISBN",
            lcc: "LCC",
            ddc: "DDC",
          }).map(([field, label]) => (
            <div key={field} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`check-${field}`}
                name={field}
                checked={checkedFields[field]}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {getFieldValue(field) || "N/A"}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cataloging..." : "Catalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
