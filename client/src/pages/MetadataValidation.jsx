import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import PageTitle from "../PageTitle";
import api from "../utils/api";
import MetadataValidationForm from "../components/authority-control/MetadataValidationForm";
import MetadataValidationResult from "../components/authority-control/MetadataValidationResult";
import AuthorityBreadCrumb from "../components/ui/AuthorityBreadCrumb";

function MetadataValidation() {
  const [bibliographicRecords, setBibliographicRecords] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    fetchBibliographicRecords();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchBibliographicRecords = async () => {
    try {
      const response = await api.get("/bibliographic");
      const uniqueRecords = response.data.filter(
        (record, index, self) =>
          index === self.findIndex((r) => r.isbn === record.isbn),
      );
      setBibliographicRecords(uniqueRecords);
    } catch (error) {
      console.error("Error fetching bibliographic records:", error);
      setMessage("Error fetching records. Please try again.");
      setMessageType("error");
    }
  };

  const handleValidate = async (selectedBibliographicId) => {
    try {
      const response = await api.post("/metadata/validate", {
        bibliographicId: selectedBibliographicId,
      });
      setMessage("Validation completed successfully");
      setMessageType("success");
      setValidationResult({
        isValid: true,
        metadata: response.data.metadata,
      });
    } catch (error) {
      setMessage(
        error.response?.data?.error || error.message || "An error occurred",
      );
      setMessageType("error");
      setValidationResult({
        isValid: false,
        errors: [error.response?.data?.error || error.message],
      });
    }
  };

  const closeAlert = () => {
    setMessage(null);
    setMessageType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <PageTitle title="Metadata Validation" />
      <div className="container mx-auto max-w-5xl">
        <AuthorityBreadCrumb />
        <h1 className="mb-4 mt-2 text-center text-2xl font-bold md:mb-4 md:mt-4 md:text-3xl">
          Validate Metadata
        </h1>
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <MetadataValidationForm
              bibliographicRecords={bibliographicRecords}
              onValidate={handleValidate}
            />
            <MetadataValidationResult validationResult={validationResult} />
          </div>
        </div>
      </div>
      {message && (
        <div
          className={`fixed bottom-4 right-4 max-w-md rounded-lg p-4 shadow-lg ${
            messageType === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : messageType === "warning"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>{message}</span>
            <button
              onClick={closeAlert}
              className="ml-2 text-xl font-bold focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetadataValidation;
