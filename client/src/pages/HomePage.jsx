import React from "react";
import { Link } from "react-router-dom";
import { Book, Database, Search, List, Users } from "lucide-react";
import PageTitle from "../PageTitle";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <PageTitle title="Home" />
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Library Cataloging System
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            A comprehensive tool for managing and organizing library resources
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            to="/catalog"
            icon={<Book className="h-8 w-8" />}
            title="Manual Cataloging"
            description="Create and edit bibliographic records manually, generate MARC21 data, and assign initial classifications."
            bgColorClass="bg-blue-100"
            darkBgColorClass="dark:bg-blue-900"
            textColorClass="text-blue-600"
            darkTextColorClass="dark:text-blue-400"
          />
          <FeatureCard
            to="/catalog/ai"
            icon={<Database className="h-8 w-8" />}
            title="AI-Assisted Cataloging"
            description="Use AI to automatically generate bibliographic records, suggest classifications, and streamline the cataloging process."
            bgColorClass="bg-indigo-100"
            darkBgColorClass="dark:bg-indigo-900"
            textColorClass="text-indigo-600"
            darkTextColorClass="dark:text-indigo-400"
          />
          <FeatureCard
            to="/classification"
            icon={<Search className="h-8 w-8" />}
            title="Classification Tools"
            description="Verify existing classifications or convert between Dewey Decimal (DDC) and Library of Congress (LCC) systems."
            bgColorClass="bg-green-100"
            darkBgColorClass="dark:bg-green-900"
            textColorClass="text-green-600"
            darkTextColorClass="dark:text-green-400"
          />
          <FeatureCard
            to="/indexes"
            icon={<List className="h-8 w-8" />}
            title="Index Management"
            description="Create and manage subject headings, generate indexes for your catalog, and organize your collection."
            bgColorClass="bg-yellow-100"
            darkBgColorClass="dark:bg-yellow-900"
            textColorClass="text-yellow-600"
            darkTextColorClass="dark:text-yellow-400"
          />
          <FeatureCard
            to="/authority"
            icon={<Users className="h-8 w-8" />}
            title="Authority Control"
            description="Manage authorized headings, extract and standardize metadata, and ensure consistency across your catalog."
            bgColorClass="bg-purple-100"
            darkBgColorClass="dark:bg-purple-900"
            textColorClass="text-purple-600"
            darkTextColorClass="dark:text-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  to,
  icon,
  title,
  description,
  bgColorClass,
  darkBgColorClass,
  textColorClass,
  darkTextColorClass,
}) => (
  <Link
    to={to}
    className={`rounded-lg ${bgColorClass} p-6 shadow transition-all hover:shadow-lg ${darkBgColorClass} dark:text-gray-100 dark:opacity-75 dark:duration-300 dark:hover:opacity-100`}
  >
    <div className={`mb-4 ${textColorClass} ${darkTextColorClass}`}>{icon}</div>
    <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
    <p>{description}</p>
  </Link>
);

export default HomePage;
