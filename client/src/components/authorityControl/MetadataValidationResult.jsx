import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

function MetadataValidationResult({ validationResult }) {
  if (!validationResult) {
    return (
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
        <p className="text-base font-semibold md:text-lg">Validation Result</p>
        <p className="text-gray-500 dark:text-gray-400">
          Validation results will appear here after submission.
        </p>
      </div>
    );
  }

  const { isValid, metadata, errors } = validationResult;

  const renderMetadataField = (key, value) => {
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
      <div
        className={`p-4 text-white ${isValid ? "bg-green-500" : "bg-red-500"}`}
      >
        <div className="flex items-center">
          {isValid ? (
            <CheckCircle className="mr-2 h-6 w-6" />
          ) : (
            <XCircle className="mr-2 h-6 w-6" />
          )}
          <p className="text-lg font-medium">
            Validation {isValid ? "Successful" : "Failed"}
          </p>
        </div>
      </div>
      <div className="p-4">
        {isValid ? (
          <>
            <h3 className="mb-2 text-lg font-semibold">Validated Metadata</h3>
            {metadata && typeof metadata === "object" ? (
              Object.entries(metadata).map(([key, value]) =>
                renderMetadataField(key, value),
              )
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No metadata available or invalid format.
              </p>
            )}
          </>
        ) : (
          <>
            <h3 className="mb-2 text-lg font-semibold">Validation Errors</h3>
            <ul className="list-inside list-disc">
              {errors.map((error, index) => (
                <li key={index} className="text-red-500">
                  {error}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default MetadataValidationResult;
