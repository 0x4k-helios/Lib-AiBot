import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import PageTitle from "../PageTitle";
import api from "../utils/api";
import ClassificationForm from "../components/Classification/ClassificationForm";
import ClassificationResult from "../components/Classification/ClassificationResult";

// Classification component to classify bibliographic records
function Classification() {
  // State to manage bibliographic records
  const [bibliographicRecords, setBibliographicRecords] = useState([]);
  // State to manage the classification result
  const [classification, setClassification] = useState(null);
  // State to manage alert messages
  const [message, setMessage] = useState(null);
  // State to manage the type of alert message
  const [messageType, setMessageType] = useState(null);

  // Fetch bibliographic records on component mount
  useEffect(() => {
    fetchBibliographicRecords();
  }, []);

  // Clear the message after 6 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Function to fetch bibliographic records from the API
  const fetchBibliographicRecords = async () => {
    try {
      const response = await api.get("/bibliographic");
      // Filter out duplicate records based on ISBN
      const uniqueRecords = response.data.filter(
        (record, index, self) =>
          index === self.findIndex((r) => r.isbn === record.isbn),
      );
      setBibliographicRecords(uniqueRecords);
    } catch (error) {
      console.error("Error fetching bibliographic records:", error);
    }
  };

  // Function to handle classification of a selected bibliographic record
  const handleClassify = async (selectedBibliographicId) => {
    try {
      const response = await api.post("/classification/classify", {
        bibliographicId: selectedBibliographicId,
      });
      setMessage(response.data.message);
      setMessageType(
        response.data.message === "Classification already exists"
          ? "warning"
          : "success",
      );
      setClassification(response.data.classification);
    } catch (error) {
      setMessage(
        error.response?.data?.error || error.message || "An error occurred",
      );
      setMessageType("error");
    }
  };

  // Function to close the alert message
  const closeAlert = () => {
    setMessage(null);
    setMessageType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <PageTitle title="Classification" />
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Classify Bibliographic Record
        </h1>
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <ClassificationForm
            bibliographicRecords={bibliographicRecords}
            onClassify={handleClassify}
          />
          <ClassificationResult classification={classification} />
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

export default Classification;
