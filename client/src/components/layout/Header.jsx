import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false);
  const location = useLocation();
  const catalogRef = useRef(null);

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
    { path: "/authority", label: "Authority" },
  ];

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

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCatalogOpen(false);
    setIsMobileCatalogOpen(false);
  }, [location.pathname]);

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  const toggleMobileCatalog = () => {
    setIsMobileCatalogOpen(!isMobileCatalogOpen);
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
          <NavLink
            to="/"
            className="group relative text-3xl font-light tracking-tight text-gray-800 transition-colors duration-300 dark:text-gray-100"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">
              Lib
            </span>
            <span className="inline-block font-bold text-blue-600 transition-all duration-300 group-hover:translate-y-1 dark:text-blue-400">
              Catalog
            </span>
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full dark:bg-blue-400"></span>
          </NavLink>

          <nav className="hidden space-x-1 md:flex">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                ref={item.submenu ? catalogRef : null}
              >
                {item.submenu ? (
                  <button
                    onClick={toggleCatalog}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                      location.pathname.startsWith(item.path)
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
                {item.submenu && isCatalogOpen && (
                  <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm ${
                              isActive
                                ? "bg-gray-100 text-blue-700 dark:bg-gray-700 dark:text-blue-300"
                                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

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

        {isMenuOpen && (
          <nav className="space-y-1 pb-4 md:hidden">
            {navItems.map((item) => (
              <div key={item.path}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={toggleMobileCatalog}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-base font-medium ${
                        location.pathname.startsWith(item.path)
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isMobileCatalogOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isMobileCatalogOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block rounded-md px-3 py-2 text-sm font-medium ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                              }`
                            }
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsMobileCatalogOpen(false);
                            }}
                          >
                            {subItem.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-base font-medium ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
