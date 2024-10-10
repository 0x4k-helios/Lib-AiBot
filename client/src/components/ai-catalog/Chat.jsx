import { useState, useEffect, useRef } from "react";
import CatalogedBooks from "./CatalogedBooks";
import api from "../../utils/api";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import CatalogingPanel from "./CatalogingPanel";

const Chat = ({ initialQuery, onQueryChange }) => {
  // State declarations
  const [query, setQuery] = useState(initialQuery || "");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [catalogingBook, setCatalogingBook] = useState(null);
  const [catalogedBooks, setCatalogedBooks] = useState([]);

  // Ref for chat scrolling behavior
  const chatContainerRef = useRef(null);

  // Effect to update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  // Function to scroll chat to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { type: "user", content: query }]);

    try {
      const response = await api.post("/query", { query });
      const responseData = response.data;

      // Process the response and add AI message
      if (
        responseData.action === "search_books" &&
        responseData.data?.docs?.length > 0
      ) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: responseData.userMessage || "Here are the books I found:",
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
            content: responseData.response || responseData.message,
            action: responseData.action,
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing request:", error.message);
      setMessages((prev) => [
        ...prev,
        { type: "error", content: "An error occurred. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setQuery("");
      onQueryChange("");
    }
  };

  // Function to handle book cataloging
  const handleCatalog = (book) => {
    setCatalogingBook(book);
  };

  return (
    <div className="mb-32 flex flex-col gap-4 border border-gray-200 dark:border-gray-700 lg:h-screen lg:flex-row lg:gap-0 lg:rounded-lg">
      <div className="flex flex-grow flex-col rounded-md bg-gray-100 dark:bg-gray-800">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          chatContainerRef={chatContainerRef}
          onCatalog={handleCatalog}
        />
        <ChatInput
          query={query}
          setQuery={setQuery}
          onQueryChange={onQueryChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
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

export default Chat;
