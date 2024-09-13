import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight, Home, Book, Database } from "lucide-react";

const BreadcrumbNav = () => {
  const location = useLocation();

  const breadcrumbLinks = [
    { to: "/", label: "Home", icon: <Home size={16} /> },
    {
      to: "/catalog/manual",
      label: "Manual Cataloging",
      icon: <Book size={16} />,
    },
    {
      to: "/catalog/ai",
      label: "AI-Assisted Cataloging",
      icon: <Database size={16} />,
    },
  ];

  const getCurrentCrumb = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return null; // Don't show breadcrumb on homepage
    const currentLink = breadcrumbLinks.find((link) => link.to === currentPath);
    return currentLink
      ? [breadcrumbLinks[0], currentLink]
      : [breadcrumbLinks[0]];
  };

  const currentCrumbs = getCurrentCrumb();

  if (!currentCrumbs) return null;

  return (
    <nav
      className="flex items-center space-x-2 py-4 text-sm"
      aria-label="Breadcrumb"
    >
      {currentCrumbs.map((link, index) => (
        <React.Fragment key={link.to}>
          {index > 0 && (
            <ChevronRight
              size={16}
              className="text-gray-400 dark:text-gray-500"
            />
          )}
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-1 rounded-md px-2 py-1 transition-all duration-300 ${
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`
            }
            end
          >
            {link.icon && <span className="mr-1">{link.icon}</span>}
            <span>{link.label}</span>
          </NavLink>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;
