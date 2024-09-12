import { FaGithub } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-6 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="text-center sm:text-left">
            <p className="text-sm">
              &copy; {currentYear} Library Cataloging System. All rights
              reserved.
            </p>
          </div>
          <NavLink
            to={"https://github.com/NabsCodes/LibCatalog"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <FaGithub />
            <span className="text-sm">GitHub</span>
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
