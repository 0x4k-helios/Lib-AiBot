import React, { useState } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";

function MetadataValidationForm({ bibliographicRecords, onValidate }) {
  const [selectedBibliographicId, setSelectedBibliographicId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBibliographicId) return;

    setIsSubmitting(true);
    try {
      await onValidate(selectedBibliographicId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-6 flex items-center justify-center">
        <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
        <p className="text-center text-lg font-semibold">Validate Metadata</p>
      </div>
      <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
        Select a Bibliographic Record
      </label>
      <select
        value={selectedBibliographicId}
        onChange={(e) => setSelectedBibliographicId(e.target.value)}
        className="mb-4 w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select a record</option>
        {bibliographicRecords.map((record) => (
          <option key={record._id} value={record._id}>
            ISBN: {record.isbn} - Title: {record.title}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="w-full cursor-pointer rounded-md bg-green-500 py-2 font-semibold text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:bg-green-300 dark:bg-green-600"
        disabled={isSubmitting || !selectedBibliographicId}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            <span>Validating...</span>
          </div>
        ) : (
          <span>Validate Metadata</span>
        )}
      </button>
    </form>
  );
}

export default MetadataValidationForm;
