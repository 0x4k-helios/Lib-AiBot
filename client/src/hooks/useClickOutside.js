import { useEffect } from "react";

// Custom hook to detect clicks outside of a specified element
function useClickOutside(ref, onOutsideClick) {
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the clicked element is outside the referenced element
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick(); // Call the provided callback function
      }
    }

    // Add event listener for mouse down events
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onOutsideClick]); // Re-run the effect if ref or onOutsideClick changes
}

export default useClickOutside;
