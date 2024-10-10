import { FaBook } from "react-icons/fa";
import MessageContent from "./MessageContent";

const MessageList = ({ messages, isLoading, chatContainerRef, onCatalog }) => {
  return (
    <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-auto p-4">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`mx-auto max-w-2xl ${
              message.type === "user" ? "text-right" : "text-left"
            }`}
          >
            <MessageContent message={message} onCatalog={onCatalog} />
          </div>
        ))
      )}
      {isLoading && <ThinkingIndicator />}
    </div>
  );
};

const EmptyState = () => (
  <div className="flex h-full flex-col items-center py-2 text-center">
    <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
      <FaBook className="h-8 w-8 text-blue-500 dark:text-blue-300" />
    </div>
    <h2 className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-300">
      AI Assistant
    </h2>
    <p className="max-w-md text-sm text-gray-500 dark:text-gray-400 md:text-base">
      Your intelligent companion for library management.
    </p>
    <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 md:text-sm">
      Start by asking a question or use a prompt suggestion above.
    </p>
  </div>
);

const ThinkingIndicator = () => (
  <div className="mx-auto max-w-2xl text-left">
    <div className="inline-block animate-pulse rounded-lg bg-gray-300 p-2 text-black dark:bg-gray-700 dark:text-white">
      Thinking...
    </div>
  </div>
);

export default MessageList;
