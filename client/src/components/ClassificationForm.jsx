import { useState, useEffect } from "react";
import { Book, RefreshCw } from "lucide-react";

// ClassificationForm component to classify a bibliographic record
function ClassificationForm({ bibliographicRecords, onClassify }) {
  // State to manage the selected bibliographic record ID
  const [selectedBibliographicId, setSelectedBibliographicId] = useState("");
  // State to manage form validation errors
  const [errors, setErrors] = useState({});
  // State to manage the submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear validation errors after 6 seconds
  useEffect(() => {
    const errorTimers = Object.keys(errors).map((key) =>
      setTimeout(() => {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[key];
          return newErrors;
        });
      }, 6000),
    );

    return () => {
      errorTimers.forEach(clearTimeout);
    };
  }, [errors]);

  // Handle change in the select input
  const handleChange = (e) => {
    setSelectedBibliographicId(e.target.value);
  };

  // Validate the form input
  const validate = () => {
    const newErrors = {};
    if (!selectedBibliographicId)
      newErrors.bibliographicId = "Bibliographic record is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      await onClassify(selectedBibliographicId);
      setSelectedBibliographicId("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-6 flex items-center justify-center">
        <Book className="mr-2 h-6 w-6 text-blue-500" />
        <p className="text-center text-lg font-semibold">
          ISBN to DDC or LCC Classification
        </p>
      </div>
      <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
        Select ISBN or Title
      </label>
      <select
        name="bibliographicId"
        value={selectedBibliographicId}
        onChange={handleChange}
        className="mb-4 w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="" disabled>
          Select a bibliographic record
        </option>
        {bibliographicRecords.map((record) => (
          <option key={record._id} value={record._id}>
            ISBN: {record.isbn} - Title: {record.title}
          </option>
        ))}
      </select>
      {errors.bibliographicId && (
        <p className="mb-4 text-sm text-red-500">{errors.bibliographicId}</p>
      )}
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            <span>Classifying...</span>
          </div>
        ) : (
          <span>Classify</span>
        )}
      </button>
    </form>
  );
}

export default ClassificationForm;
