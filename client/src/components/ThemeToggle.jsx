import { useContext, useState, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Adjust the import path as necessary
import useClickOutside from "../hooks/useClickOutside";
import { Sun, Moon, Monitor } from "lucide-react"; // Import icons from lucide-react

const ThemeToggle = () => {
  const { theme, setMode } = useContext(ThemeContext); // Use context to get current theme and function to change theme
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleToggle = (newTheme) => {
    setMode(newTheme); // Use setMode from context to change theme
    setIsOpen(false);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="inline font-semibold" size={20} />;
      case "dark":
        return <Moon className="inline font-semibold" size={20} />;
      case "system":
        return <Monitor className="inline font-semibold" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300 focus:ring-1 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        aria-label="Theme toggle"
      >
        <span className="font-semibold">{getIcon()}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-800">
          <button
            onClick={() => handleToggle("light")}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "light" ? "text-yellow-500" : "text-gray-500"} rounded-t-md`}
            aria-label="Light theme"
          >
            <Sun className="mr-2 inline" size={20} /> Light
          </button>
          <button
            onClick={() => handleToggle("dark")}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "dark" ? "text-blue-500" : "text-gray-500"}`}
            aria-label="Dark theme"
          >
            <Moon className="mr-2 inline" size={20} /> Dark
          </button>
          <button
            onClick={() => handleToggle("system")}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "system" ? "text-green-500" : "text-gray-500"} rounded-b-md`}
            aria-label="System theme"
          >
            <Monitor className="mr-2 inline" size={20} /> System
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
