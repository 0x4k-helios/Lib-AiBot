import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaInfoCircle, FaBook, FaExclamationTriangle } from "react-icons/fa";
import BookList from "./BookList";

// MessageContent component to display different types of messages
const MessageContent = ({ message, onCatalog }) => {
  switch (message.type) {
    case "user":
      // Render user message
      return (
        <div className="inline-block rounded-lg bg-blue-500 px-4 py-2 text-white">
          {message.content}
        </div>
      );
    case "ai":
      // Render AI message with optional icons and markdown content
      return (
        <div className="inline-block max-w-2xl rounded-lg bg-white p-4 shadow-md dark:bg-gray-700 dark:text-white">
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
      // Render a list of books
      return (
        <BookList
          books={message.content}
          totalResults={message.totalResults}
          onCatalog={onCatalog}
        />
      );
    case "error":
      // Render error message
      return (
        <div className="inline-block rounded-lg bg-red-200 p-4 text-red-700">
          <FaExclamationTriangle className="mb-2 text-red-500" />
          {message.content}
        </div>
      );
    default:
      // Render nothing for unknown message types
      return (
        <div className="inline-block rounded-lg bg-gray-200 p-4 text-gray-700">
          Unknown message type: {message.type}
        </div>
        // null
      );
  }
};

export default MessageContent;
