import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Book, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import BreadcrumbNav from "../components/ui/BreadCrumbNav";
import PageTitle from "../PageTitle";
import api from "../utils/api";

function ManualCatalog() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publicationDate: new Date(),
    isbn: "",
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [generatedMetadata, setGeneratedMetadata] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      publicationDate: date,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.isbn) newErrors.isbn = "ISBN is required";
    if (!/^\d{13}$/.test(formData.isbn))
      newErrors.isbn = "ISBN must be 13 digits";
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
      const response = await api.post("/bibliographic/create", {
        ...formData,
        publicationDate: formData.publicationDate.toISOString().split("T")[0],
      });
      setMessage(response.data.message);
      setMessageType("success");
      setGeneratedMetadata(response.data.marc21Record);
      setFormData({
        title: "",
        author: "",
        publicationDate: new Date(),
        isbn: "",
      });
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
      <PageTitle title="Manual Catalog" />
      <div className="container mx-auto max-w-4xl">
        <BreadcrumbNav />
        <h1 className="mb-8 text-center text-3xl font-bold">
          Create Bibliographic Record
        </h1>
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-center">
            <Book className="mr-2 h-6 w-6 text-blue-500" />
            <p className="text-center text-lg font-semibold">
              Manual Cataloging and MARC21 Generation
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the author"
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-500">{errors.author}</p>
                )}
              </div>
              <div>
                <label className="flex flex-col">
                  <span className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
                    Publication Date
                  </span>
                  <DatePicker
                    selected={formData.publicationDate}
                    onChange={handleDateChange}
                    className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    dateFormat="yyyy-MM-dd"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  />
                </label>
              </div>
              <div>
                <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the ISBN"
                />
                {errors.isbn && (
                  <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <span>Create Record</span>
                )}
              </button>
            </form>
            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
              <h2 className="mb-2 text-lg font-semibold">
                Generated MARC21 Record
              </h2>
              {generatedMetadata ? (
                <pre className="whitespace-pre-wrap break-words text-sm">
                  {generatedMetadata.split("\n").map((line, index) => (
                    <div key={index}>{line.trim()}</div>
                  ))}
                </pre>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  MARC21 record will appear here after submission.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {message && (
        <div
          className={`fixed bottom-4 right-4 max-w-md rounded-lg p-4 shadow-lg ${
            messageType === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
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

export default ManualCatalog;
