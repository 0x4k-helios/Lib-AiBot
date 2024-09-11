import React, { useState, useEffect } from "react";
import axios from "axios";
import { Book, RefreshCw, AlertCircle } from "lucide-react";
import PageTitle from "../PageTitle";

function Classification() {
  const [bibliographicRecords, setBibliographicRecords] = useState([]);
  const [selectedBibliographicId, setSelectedBibliographicId] = useState("");
  const [classification, setClassification] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBibliographicRecords = async () => {
      try {
        const response = await axios.get("http://localhost:3000/bibliographic");
        const uniqueRecords = response.data.filter(
          (record, index, self) =>
            index === self.findIndex((r) => r.isbn === record.isbn),
        );
        setBibliographicRecords(uniqueRecords);
      } catch (error) {
        console.error("Error fetching bibliographic records:", error);
      }
    };

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

  const handleChange = (e) => {
    setSelectedBibliographicId(e.target.value);
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
      setMessage("Please fix the errors in the form.");
      setMessageType("error");
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/classification/classify",
        { bibliographicId: selectedBibliographicId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      setMessage(response.data.message);
      setMessageType(
        response.data.message === "Classification already exists"
          ? "warning"
          : "success",
      );
      setClassification(response.data.classification);
      setSelectedBibliographicId("");
    } catch (error) {
      setMessage(
        error.response?.data?.error || error.message || "An error occurred",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="mb-6 flex items-center justify-center">
            <Book className="mr-2 h-6 w-6 text-blue-500" />
            <p className="text-center text-lg font-semibold">
              ISBN to DDC or LCC Classification
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
              Select a Bibliographic Record
            </label>
            <select
              name="bibliographicId"
              value={selectedBibliographicId}
              onChange={handleChange}
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
              <p className="mb-4 text-sm text-red-500">
                {errors.bibliographicId}
              </p>
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
          <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
            <h2 className="mb-2 text-lg font-semibold">
              Classification Result{" "}
              <span className="block text-sm italic text-gray-500">
                This is dummy data for demo purposes
              </span>
            </h2>
            {classification ? (
              <div className="space-y-2 text-xl">
                <p>
                  <span className="font-semibold">DDC:</span>{" "}
                  {classification.ddc}
                </p>
                <p>
                  <span className="font-semibold">LCC:</span>{" "}
                  {classification.lcc}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Classification results will appear here after submission.
              </p>
            )}
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

export default Classification;
