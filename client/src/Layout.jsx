import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldShowFooter = location.pathname !== "/catalog/ai";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-gray-100">
        {children}
      </main>
      {shouldShowFooter && <Footer />}
    </>
  );
};

export default Layout;
