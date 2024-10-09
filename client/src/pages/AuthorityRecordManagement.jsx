import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";
import api from "../utils/api";
import PageTitle from "../PageTitle";

const AuthorityRecordManagement = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get("/authority/records");
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(
        `/authority/records/search?term=${searchTerm}`,
      );
      setRecords(response.data);
    } catch (error) {
      console.error("Error searching records:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const handleSave = async () => {
    try {
      if (editingRecord._id) {
        await api.put(`/authority/records/${editingRecord._id}`, editingRecord);
      } else {
        await api.post("/authority/records", editingRecord);
      }
      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/authority/records/${id}`);
      fetchRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <PageTitle title="Authority Record Management" />
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Authority Record Management
        </h1>

        <div className="mb-4 flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records..."
            className="flex-grow rounded-l-md border-gray-300 px-4 py-2 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <button
            onClick={handleSearch}
            className="rounded-r-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Search size={20} />
          </button>
        </div>

        <button
          onClick={() =>
            setEditingRecord({ heading: "", alternativeForms: [], notes: "" })
          }
          className="mb-4 flex items-center rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          <Plus size={20} className="mr-2" /> Add New Record
        </button>

        {editingRecord && (
          <div className="mb-4 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold">
              {editingRecord._id ? "Edit Record" : "New Record"}
            </h2>
            <input
              type="text"
              value={editingRecord.heading}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, heading: e.target.value })
              }
              placeholder="Heading"
              className="mb-2 w-full rounded-md border-gray-300 px-4 py-2"
            />
            <textarea
              value={editingRecord.notes}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, notes: e.target.value })
              }
              placeholder="Notes"
              className="mb-2 w-full rounded-md border-gray-300 px-4 py-2"
            />
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        )}

        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record._id}
              className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
            >
              <h3 className="mb-2 text-lg font-semibold">{record.heading}</h3>
              <p className="mb-2 text-gray-600 dark:text-gray-400">
                {record.notes}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(record)}
                  className="rounded-md bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorityRecordManagement;
