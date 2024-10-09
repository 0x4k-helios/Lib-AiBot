import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

// Define navigation items
const navItems = [
  {
    path: "/catalog",
    label: "Catalog",
    submenu: [
      { path: "/catalog/manual", label: "Manual Cataloging" },
      { path: "/catalog/ai", label: "AI-Assisted Cataloging" },
    ],
  },
  { path: "/classification", label: "Classification" },
  { path: "/indexes", label: "Indexes" },
  {
    path: "/authority",
    label: "Authority",
    // submenu: [
    //   { path: "/authority/extract", label: "Metadata Extraction" },
    //   { path: "/authority/validate", label: "Metadata Validation" },
    // ],
  },
];

const Header = () => {
  // State for mobile menu, scroll status, and catalog submenu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const location = useLocation();
  const catalogRef = useRef(null);

  // Scroll restoration function
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Effect to handle scroll and clicks outside the catalog menu
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        setIsCatalogOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCatalogOpen(false);
  }, [location.pathname]);

  // Toggle catalog submenu
  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  // Render navigation items
  const renderNavItems = (isMobile = false) => {
    return navItems.map((item) => (
      <div
        key={item.path}
        className={isMobile ? "" : "relative"}
        ref={item.submenu ? catalogRef : null}
      >
        {item.submenu ? (
          // Render submenu for Catalog
          <>
            <button
              onClick={toggleCatalog}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                location.pathname.startsWith(item.path)
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              } ${isMobile ? "w-full text-left" : ""}`}
            >
              {item.label}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isCatalogOpen && (
              <div
                className={
                  isMobile
                    ? "ml-4 mt-1 space-y-1"
                    : "absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
                }
              >
                <div className={isMobile ? "" : "py-1"}>
                  {item.submenu.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "bg-gray-100 text-blue-700 dark:bg-gray-700 dark:text-blue-300"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                        } ${isMobile ? "rounded-md" : ""}`
                      }
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsCatalogOpen(false);
                      }}
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // Render regular menu item
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              } ${isMobile ? "w-full" : ""}`
            }
            onClick={() => isMobile && setIsMenuOpen(false)}
          >
            {item.label}
          </NavLink>
        )}
      </div>
    ));
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b bg-white/95 backdrop-blur-sm dark:bg-gray-900/95"
          : "bg-white dark:bg-gray-900"
      } border-gray-200 dark:border-gray-700`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="group relative text-3xl font-light tracking-tight text-gray-800 transition-colors duration-300 dark:text-gray-100"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">
              Lib
            </span>
            <span className="inline-block font-bold text-blue-600 transition-all duration-300 group-hover:translate-y-1 dark:text-blue-400">
              MetaBot
            </span>
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full dark:bg-blue-400"></span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-1 md:flex">{renderNavItems()}</nav>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <button
              className="rounded-full p-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="space-y-1 pb-4 md:hidden">{renderNavItems(true)}</nav>
        )}
      </div>
    </header>
  );
};

export default Header;
