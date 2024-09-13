import React from "react";
import { Link } from "react-router-dom";
import { BookX, Home, ArrowRight } from "lucide-react";
import PageTitle from "../PageTitle";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 text-center dark:from-gray-900 dark:to-gray-800">
      <PageTitle title="404 Page Not Found" />
      <div className="mb-8 animate-bounce">
        <BookX size={120} className="text-blue-500 dark:text-blue-400" />
      </div>
      <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-gray-100">
        4<span className="text-blue-500 dark:text-blue-400">0</span>4
      </h1>
      <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
        Oops! It seems this page is missing or doesn't exist.
      </p>
      <div className="group relative inline-block overflow-hidden rounded-full p-0.5 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600">
        <Link
          to="/"
          className="inline-flex items-center rounded-full bg-white px-6 py-3 text-lg font-medium text-gray-800 transition-all duration-300 group-hover:bg-opacity-90 dark:bg-gray-800 dark:text-white"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Home
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        Lost? Try using the navigation bar above.
      </div>
    </div>
  );
}

export default NotFound;
