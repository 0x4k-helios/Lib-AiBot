import React from "react";
import { Link } from "react-router-dom";
import { Book, Database, Search, List, Users, ArrowRight } from "lucide-react";
import PageTitle from "../PageTitle";

const HomePage = () => {
  const features = [
    {
      to: "/catalog/manual",
      icon: <Book className="h-8 w-8" />,
      title: "Manual Cataloging",
      description: "Create and edit bibliographic records manually.",
      color: "from-blue-400 to-blue-600",
    },
    {
      to: "/catalog/ai",
      icon: <Database className="h-8 w-8" />,
      title: "AI-Assisted Cataloging",
      description: "Use AI to streamline the cataloging process.",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      to: "/classification",
      icon: <Search className="h-8 w-8" />,
      title: "Classification Tools",
      description: "Convert between DDC and LCC systems.",
      color: "from-green-400 to-green-600",
    },
    {
      to: "/indexes",
      icon: <List className="h-8 w-8" />,
      title: "Index Management",
      description: "Create and manage subject headings and indexes.",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      to: "/authority",
      icon: <Users className="h-8 w-8" />,
      title: "Authority Control",
      description: "Manage authorized headings and metadata.",
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PageTitle title="Home" />
      <div className="container mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <div className="animate-float mb-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 p-3 shadow-lg">
            <Book className="h-12 w-12 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Library Meta Bot
            </span>{" "}
            System
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Revolutionize your library management with our comprehensive,
            AI-powered cataloging tools & metadata management system.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.to}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800"
            >
              <div className="relative z-10">
                <div
                  className={`mb-4 inline-block rounded-full bg-gradient-to-br ${feature.color} p-3 text-white`}
                >
                  {feature.icon}
                </div>
                <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Explore feature
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
              <div
                className={`absolute -bottom-2 -right-2 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} opacity-10 transition-transform duration-300 group-hover:scale-150`}
              />
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Ready to transform your library?
          </h2>
          <Link
            to="/catalog/ai"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          >
            Get Started with AI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
