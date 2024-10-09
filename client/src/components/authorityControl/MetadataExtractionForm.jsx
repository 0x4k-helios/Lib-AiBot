import { useState, useEffect } from "react";
import { Database, RefreshCw } from "lucide-react";

function MetadataExtractionForm({ bibliographicRecords, onExtract }) {
  const [selectedBibliographicId, setSelectedBibliographicId] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("json");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleBibliographicChange = (e) => {
    setSelectedBibliographicId(e.target.value);
  };

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedBibliographicId)
      newErrors.bibliographicId = "Bibliographic record is required";
    return newErrors;
  };

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
      await onExtract(selectedBibliographicId, selectedFormat);
      setSelectedBibliographicId("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-6 flex flex-col items-center justify-center sm:flex-row">
        <Database className="mr-2 h-6 w-6 text-blue-500" />
        <p className="text-center text-base font-semibold md:text-lg">
          Extract Metadata from Bibliographic Record
        </p>
      </div>
      <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
        Select a Bibliographic Record
      </label>
      <select
        name="bibliographicId"
        value={selectedBibliographicId}
        onChange={handleBibliographicChange}
        className="mb-4 w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="" disabled>
          Select a record
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
      <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
        Select Format
      </label>
      <select
        name="format"
        value={selectedFormat}
        onChange={handleFormatChange}
        className="mb-4 w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="json">JSON</option>
        <option value="xml" disabled>
          XML
        </option>
        <option value="csv" disabled>
          CSV
        </option>
      </select>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            <span>Extracting...</span>
          </div>
        ) : (
          <span>Extract Metadata</span>
        )}
      </button>
    </form>
  );
}

export default MetadataExtractionForm;
