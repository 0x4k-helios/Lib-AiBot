import { useState } from "react";
import api from "../../utils/api";

// CatalogingPanel component to catalog a book
const CatalogingPanel = ({ book, onClose, onCatalogSuccess }) => {
  // State to manage which fields are checked
  const [checkedFields, setCheckedFields] = useState({
    title: true,
    author: true,
    publishYear: true,
    publisher: true,
    isbn: true,
    lcc: true,
    ddc: true,
  });

  // State to manage the submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to manage the message to display
  const [message, setMessage] = useState({ type: "", content: "" });

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    setCheckedFields({ ...checkedFields, [e.target.name]: e.target.checked });
  };

  // Get the value of a field from the book object
  const getFieldValue = (field) => {
    const value =
      book[field] || book[field === "author" ? "author_name" : field];
    return Array.isArray(value) ? value[0] : value; // Return the first item of the array
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" }); // Reset the message

    // Check if at least one field is selected
    if (Object.values(checkedFields).every((value) => !value)) {
      setMessage({
        type: "error",
        content: "Please select at least one field to catalog.",
      });
      return;
    }

    setIsSubmitting(true); // Set the submission status to true

    try {
      // Get the identifier for the book
      const identifier = getFieldValue("isbn") || book.key.split("/").pop();
      // Prepare the data to submit
      const dataToSubmit = Object.keys(checkedFields).reduce((acc, key) => {
        if (checkedFields[key]) {
          const value = getFieldValue(key);
          if (value) acc[key] = value;
        }
        return acc;
      }, {});

      // Check if there is valid data to submit
      if (Object.keys(dataToSubmit).length === 0) {
        setMessage({
          type: "error",
          content: "No valid data to catalog. Please check your selection.",
        });
        setIsSubmitting(false);
        return;
      }

      // Send the data to the API
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
          {/* Render the form fields */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>
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
              className={`rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting ? "cursor-not-allowed" : ""
              }`}
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

export default CatalogingPanel;
