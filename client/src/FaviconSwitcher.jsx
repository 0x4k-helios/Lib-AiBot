import { useEffect } from "react";
import { changeFavicon } from "./utils/changeFavicon";

const FaviconSwitcher = () => {
  useEffect(() => {
    const updateFavicon = () => {
      if (document.documentElement.classList.contains("dark")) {
        changeFavicon("/favicon-dark.svg");
      } else {
        changeFavicon("/favicon-light.svg");
      }
    };

    // Initial update
    updateFavicon();

    // Watch for changes in dark mode
    const observer = new MutationObserver(updateFavicon);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
};

export default FaviconSwitcher;
