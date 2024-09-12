import { createContext, useState, useEffect } from "react";
import { changeFavicon } from "../utils/changeFavicon";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Function to get the preferred theme from localStorage or system preference
  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) return storedTheme;
    // Fallback to system theme preference if no stored theme is found
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark";
    return "light";
  };

  const [theme, setTheme] = useState(getPreferredTheme);
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  // Effect to update systemTheme state on system preference change
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () =>
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange); // Cleanup listener on component unmount
  }, []);

  // Effect to apply the theme to the document and store it in localStorage
  useEffect(() => {
    if (theme === "system") {
      document.documentElement.className = systemTheme;
    } else {
      document.documentElement.className = theme;
    }
    localStorage.setItem("theme", theme);

    // Update the favicon based on the theme
    if (theme === "dark" || (theme === "system" && systemTheme === "dark")) {
      changeFavicon("/favicon-dark.ico");
    } else {
      changeFavicon("/favicon-light.ico");
    }
  }, [theme, systemTheme]); // Re-run effect if theme or systemTheme changes

  const setMode = (mode) => {
    setTheme(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
