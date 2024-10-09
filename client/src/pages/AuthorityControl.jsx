import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Book, Database, CheckCircle } from "lucide-react";
import PageTitle from "../PageTitle";

const AuthorityControl = () => {
  const authority = [
    {
      to: "/authority/extract",
      icon: <Database className="h-8 w-8" />,
      title: "Metadata Extraction",
      description: "Extract metadata from various formats (JSON, XML, CSV)",
      color: "from-blue-400 to-blue-600",
    },
    {
      to: "/authority/validate",
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Metadata Validation",
      description: "Validate and ensure quality of extracted metadata",
      color: "from-green-400 to-green-600",
    },
    // {
    //   to: "/authority/records",
    //   icon: <Book className="h-8 w-8" />,
    //   title: "Authority Records",
    //   description: "Manage and maintain authority records",
    //   color: "from-purple-400 to-purple-600",
    // },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <PageTitle title="Authority Control" />
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-2 text-center text-3xl font-bold">
          Authority Control
        </h1>
        <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-400">
          Extract or validate metadata to manage and maintain authority records
        </p>
        {/* <div className="grid gap-6 md:grid-cols-2">
          <NavLink
            to="/authority/extract"
            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
          >
            <Database className="mb-4 h-12 w-12 text-blue-500" />
            <h2 className="mb-2 text-xl font-semibold">Metadata Extraction</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Extract metadata from various formats (JSON, XML, CSV)
            </p>
          </NavLink>
          <NavLink
            to="/authority/validate"
            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
          >
            <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
            <h2 className="mb-2 text-xl font-semibold">Metadata Validation</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Validate and ensure quality of extracted metadata
            </p>
          </NavLink>
          <NavLink
            to="/authority/records"
            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
          >
            <Book className="mb-4 h-12 w-12 text-purple-500" />
            <h2 className="mb-2 text-xl font-semibold">Authority Records</h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Manage and maintain authority records
            </p>
          </NavLink>
        </div> */}
        <div className="grid gap-8 sm:grid-cols-2">
          {authority.map((feature, index) => (
            <Link
              key={index}
              to={feature.to}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800"
            >
              <div className="relative z-10">
                <div
                  className={`mb-4 inline-block rounded-full bg-gradient-to-br text-center ${feature.color} p-3 text-white`}
                >
                  {feature.icon}
                </div>
                <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
              <div
                className={`absolute -bottom-2 -right-2 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} opacity-10 transition-transform duration-300 group-hover:scale-150`}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorityControl;
