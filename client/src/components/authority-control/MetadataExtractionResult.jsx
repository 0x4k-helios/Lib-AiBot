import React from "react";
import { FileJson, FileText, FileSpreadsheet, Download } from "lucide-react";

function MetadataExtractionResult({ extractedMetadata }) {
  if (!extractedMetadata) {
    return (
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
        <p className="text-base font-semibold md:text-lg">Extracted Metadata</p>
        <p className="text-gray-500 dark:text-gray-400">
          Extracted metadata will appear here after submission.
        </p>
      </div>
    );
  }

  const { format, metadata } = extractedMetadata;

  const getFormatConfig = (format) => {
    switch (format.toLowerCase()) {
      case "json":
        return {
          icon: <FileJson className="h-6 w-6" />,
          color: "bg-yellow-500",
        };
      case "xml":
        return { icon: <FileText className="h-6 w-6" />, color: "bg-blue-500" };
      case "csv":
        return {
          icon: <FileSpreadsheet className="h-6 w-6" />,
          color: "bg-green-500",
        };
      default:
        return { icon: null, color: "bg-gray-500" };
    }
  };

  const formatConfig = getFormatConfig(format);

  const renderMetadataField = (key, value) => {
    if (key === "_id" || key === "__v") return null; // Skip these fields

    return (
      <div
        key={key}
        className="mb-3 flex flex-col border-b border-gray-200 pb-2 dark:border-gray-600"
      >
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </span>
        <span className="text-lg text-gray-800 dark:text-gray-200">
          {value instanceof Date ? value.toLocaleDateString() : value}
        </span>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className={`p-4 text-white ${formatConfig.color}`}>
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex items-center">
            {formatConfig.icon}
            <p className="ml-2 text-lg font-medium">
              Extracted Metadata ({format.toUpperCase()})
            </p>
          </div>
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center rounded bg-white bg-opacity-20 px-3 py-1 text-sm transition-colors duration-200 hover:bg-opacity-30 sm:w-auto"
          >
            <Download className="mr-1 h-4 w-4" />
            Download
          </button>
        </div>
      </div>
      <div className="p-4">
        {metadata && typeof metadata === "object" ? (
          Object.entries(metadata).map(([key, value]) =>
            renderMetadataField(key, value),
          )
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No metadata available or invalid format.
          </p>
        )}
      </div>
    </div>
  );
}

export default MetadataExtractionResult;
