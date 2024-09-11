import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Divider } from "@chakra-ui/react";
import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get the current location
  const location = useLocation();

  const navItems = [
    { path: "/catalog", label: "Catalog" },
    { path: "/classification", label: "Classification" },
    { path: "/indexes", label: "Indexes" },
    { path: "/authority", label: "Authority" },
  ];

  // Handle scroll to add/remove styles based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close the menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      key={location.pathname} // Force re-render on route change
      className={`sticky top-0 border-b border-slate-900/30 bg-white shadow-sm transition-all duration-300 dark:border-slate-500/60 dark:bg-gray-900 dark:text-gray-100 ${
        isScrolled ? "bg-opacity-75 backdrop-blur-sm dark:bg-opacity-75" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            LibCatalog
          </NavLink>

          {/* Navigation */}
          <nav className="mx-auto hidden space-x-4 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `cursor-pointer transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="block md:hidden">
              <Divider orientation="vertical" h={"40px"} color={"gray.900"} />
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="border-t py-4 dark:border-gray-700 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block cursor-pointer py-2 hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
