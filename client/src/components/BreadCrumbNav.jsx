import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const BreadcrumbNav = () => {
  const [breadcrumb, setBreadcrumb] = useState("Manual Entry"); // Initial breadcrumb value Path
  // Add breadcrumb links here
  const breadcrumbLinks = [
    {
      to: "/catalog",
      label: "Manual Entry",
    },
    {
      to: "/catalog/ai",
      label: "AI Entry",
    },
  ];

  // Set breadcrumb based on current location
  const location = useLocation();

  useEffect(() => {
    breadcrumbLinks.forEach((link) => {
      if (link.to === location.pathname) {
        setBreadcrumb(link.label);
      }
    });
  }, [location.pathname]); // Update breadcrumb when location changes

  return (
    <>
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumbLinks.map((link, index) => (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 10a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" />
                  </svg>
                </div>
              )}
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 dark:text-white"
                      : "text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  } ${index > 0 ? "ml-1 md:ml-2" : ""}`
                }
                end
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>
      <div className="my-4 border border-slate-900/30 dark:border-slate-500/60"></div>
    </>
  );
};

export default BreadcrumbNav;
