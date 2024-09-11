import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../PageTitle";

const Indexes = () => {
  const [bibliographicRecords, setBibliographicRecords] = useState([]);
  const [selectedBibliographicId, setSelectedBibliographicId] = useState("");
  const [newlyGeneratedHeadings, setNewlyGeneratedHeadings] = useState([]);
  const [existingHeadings, setExistingHeadings] = useState([]);
  const [subjectHeadings, setSubjectHeadings] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [isSubmittingHeadings, setIsSubmittingHeadings] = useState(false);
  const [isSubmittingSubjectHeadings, setIsSubmittingSubjectHeadings] =
    useState(false);
  const [isLoadingExistingHeadings, setIsLoadingExistingHeadings] =
    useState(false);
  const [generationSummary, setGenerationSummary] = useState(null);

  const [mappings, setMappings] = useState([
    { ddcCode: "000", title: "Computer science, information & general works" },
    { ddcCode: "100", title: "Philosophy & psychology" },
    // { ddcCode: "200", title: "Religion" },
    // { ddcCode: "300", title: "Social sciences" },
    // { ddcCode: "400", title: "Language" },
    // { ddcCode: "500", title: "Science" },
    // { ddcCode: "600", title: "Technology" },
    // { ddcCode: "700", title: "Arts & recreation" },
    // { ddcCode: "800", title: "Literature" },
    // { ddcCode: "900", title: "History & geography" },
  ]);

  useEffect(() => {
    fetchBibliographicRecords();
    fetchExistingHeadings();
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

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

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
      showMessage(
        "Failed to fetch bibliographic records. Please try again.",
        "error",
      );
    }
  };

  const fetchExistingHeadings = async () => {
    setIsLoadingExistingHeadings(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/headings/generate-headings",
      );
      setExistingHeadings(response.data);
    } catch (error) {
      console.error("Error fetching existing headings:", error);
      showMessage(
        "Failed to fetch existing headings. Please try again.",
        "error",
      );
    } finally {
      setIsLoadingExistingHeadings(false);
    }
  };

  const handleMappingChange = (index, field, value) => {
    const updatedMappings = [...mappings];
    updatedMappings[index][field] = value;
    setMappings(updatedMappings);
  };

  const handleAddMapping = () => {
    setMappings([...mappings, { ddcCode: "", title: "" }]);
  };

  const handleRemoveMapping = (index) => {
    const updatedMappings = mappings.filter((_, i) => i !== index);
    setMappings(updatedMappings);
  };

  const handleSubmitHeadings = async (e) => {
    e.preventDefault();
    if (mappings.length === 0) {
      showMessage(
        "Please add at least one mapping before generating headings.",
        "error",
      );
      return;
    }
    if (mappings.some((mapping) => !mapping.ddcCode || !mapping.title)) {
      showMessage(
        "Please fill in all mapping fields before generating headings.",
        "error",
      );
      return;
    }

    setIsSubmittingHeadings(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/headings/generate-headings",
        mappings,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      const { message, newHeadings, existingHeadings, summary } = response.data;

      setGenerationSummary(summary);
      setNewlyGeneratedHeadings(newHeadings);

      if (newHeadings.length > 0) {
        showMessage(
          `${newHeadings.length} new headings generated successfully.`,
          "success",
        );
      } else {
        showMessage(
          "No new headings were generated. All requested DDC codes already exist.",
          "warning",
        );
      }

      fetchExistingHeadings(); // Refresh the list of existing headings
    } catch (error) {
      showMessage("Error generating headings. Please try again.", "error");
    } finally {
      setIsSubmittingHeadings(false);
    }
  };

  const handleDeleteHeading = async (ddcCode) => {
    try {
      await axios.delete(
        `http://localhost:3000/headings/generate-headings/${ddcCode}`,
      );
      showMessage(`DDC code ${ddcCode} deleted successfully.`, "success");
      fetchExistingHeadings(); // Refresh the list of existing headings
    } catch (error) {
      showMessage(
        `Error deleting DDC code ${ddcCode}. Please try again.`,
        "error",
      );
    }
  };

  const handleSubmitSubjectHeadings = async (e) => {
    e.preventDefault();
    if (!selectedBibliographicId) {
      showMessage("Please select a bibliographic record.", "error");
      return;
    }
    setIsSubmittingSubjectHeadings(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/subjectHeading/generate",
        { bibliographicId: selectedBibliographicId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (response.data.subjectHeading) {
        showMessage("Subject headings generated successfully.", "success");
        setSubjectHeadings(response.data.subjectHeading);
      } else {
        showMessage("No new subject headings were generated.", "warning");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.error ||
          error.message ||
          "An error occurred while generating subject headings.",
        "error",
      );
    } finally {
      setIsSubmittingSubjectHeadings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-900 dark:text-white">
      <PageTitle title="Indexes" />
      <div className="container mx-auto">
        <h1 className="mb-2 text-center text-4xl font-bold text-gray-800 dark:text-white">
          Indexing Dashboard
        </h1>
        <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-300">
          Manage DDC mappings and generate subject headings for your
          bibliographic records.
        </p>

        {message && (
          <div
            className={`fixed bottom-4 right-4 z-50 rounded p-4 shadow-lg ${
              messageType === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : messageType === "warning"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{message}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-4 text-lg font-bold focus:outline-none"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <section className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
              DDC Mappings and Headings
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Customize the Dewey Decimal Classification (DDC) mappings below.
              These mappings will be used to generate headings.
            </p>
            <form onSubmit={handleSubmitHeadings} className="space-y-4">
              {mappings.map((mapping, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0"
                >
                  <input
                    type="text"
                    value={mapping.ddcCode}
                    onChange={(e) =>
                      handleMappingChange(index, "ddcCode", e.target.value)
                    }
                    placeholder="DDC Code"
                    className="w-full rounded-md border bg-gray-100 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 sm:w-1/4"
                  />
                  <input
                    type="text"
                    value={mapping.title}
                    onChange={(e) =>
                      handleMappingChange(index, "title", e.target.value)
                    }
                    placeholder="Title"
                    className="flex-grow rounded-md border bg-gray-100 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMapping(index)}
                    className="rounded bg-red-500 px-2 py-1 text-white transition-colors hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                <button
                  type="button"
                  onClick={handleAddMapping}
                  className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                >
                  Add Mapping
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:bg-blue-500/50"
                  disabled={isSubmittingHeadings}
                >
                  {isSubmittingHeadings ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loader"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    "Generate Headings"
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
              Subject Headings Generator
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Select a bibliographic record to generate subject headings for it.
            </p>
            <form onSubmit={handleSubmitSubjectHeadings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Bibliographic Record
                </label>
                <select
                  value={selectedBibliographicId}
                  onChange={(e) => setSelectedBibliographicId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
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
              </div>
              <button
                type="submit"
                className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:bg-blue-500/50"
                disabled={isSubmittingSubjectHeadings}
              >
                {isSubmittingSubjectHeadings ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loader"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate Subject Headings"
                )}
              </button>
            </form>

            {subjectHeadings && (
              <div className="mt-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Generated Subject Headings
                </h3>
                <ul className="mb-4 list-inside list-disc">
                  {subjectHeadings.headings.map((heading, index) => (
                    <li
                      key={index}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {heading}
                    </li>
                  ))}
                </ul>
                <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Keywords
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {subjectHeadings.keywords.join(", ")}
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <section className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
              Newly Generated Headings
            </h2>
            {generationSummary && (
              <div className="mb-4 rounded bg-blue-100 p-4 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <h3 className="mb-2 font-semibold">Generation Summary:</h3>
                <p>Total DDC codes processed: {generationSummary.total}</p>
                <p>New headings added: {generationSummary.new}</p>
                <p>Existing headings skipped: {generationSummary.existing}</p>
              </div>
            )}
            {newlyGeneratedHeadings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        DDC Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        LCC Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Subject Heading
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {newlyGeneratedHeadings.map((heading, index) => (
                      <tr key={index} className="bg-green-50 dark:bg-green-900">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {heading.ddcCode}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {heading.lccCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {heading.subjectHeading}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No new headings have been generated in this session.
              </p>
            )}
          </section>

          <section className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
              Existing Headings
            </h2>
            {isLoadingExistingHeadings ? (
              <div className="flex items-center justify-center">
                <div className="loader"></div>
                <span className="ml-2">Loading existing headings...</span>
              </div>
            ) : existingHeadings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        DDC Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        LCC Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Subject Heading
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {existingHeadings.map((heading) => (
                      <tr key={heading._id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {heading.ddcCode}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {heading.lccCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {heading.subjectHeading}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <button
                            onClick={() => handleDeleteHeading(heading.ddcCode)}
                            className="rounded bg-red-500 px-2 py-1 text-white transition-colors hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No existing headings found. Generate new headings using the form
                above.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Indexes;
