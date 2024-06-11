import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);

  // This useEffect hook runs once when the component mounts.
  // It retrieves the dark mode setting from localStorage and sets the state accordingly.
  useEffect(() => {
    // Retrieve the dark mode value from localStorage.
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    // Log the raw value retrieved from localStorage.
    console.log(
      "Retrieved from localStorage:",
      localStorage.getItem("darkMode")
    );

    // Log the evaluated boolean value for dark mode.
    console.log("Is Dark Mode:", isDarkMode);

    // Update the darkMode state with the value retrieved from localStorage.
    setDarkMode(isDarkMode);
  }, []);

  // This useEffect hook runs every time the darkMode state changes.
  // It toggles the 'dark' class on the document's root element and updates localStorage.
  useEffect(() => {
    // Log the current state of dark mode whenever it changes.
    console.log("Dark Mode State Changed:", darkMode);

    // Toggle the 'dark' class on the root element based on the current darkMode state.
    document.documentElement.classList.toggle("dark", darkMode);

    // Update the dark mode setting in localStorage with the current state.
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div>
      <button
        onClick={toggleDarkMode}
        className={`px-2 py-1 rounded-full text-black ${
          darkMode ? "bg-gray-200 dark:bg-yellow-500" : "bg-gray-200"
        } transition-colors duration-200 flex items-center`}
      >
        {darkMode ? (
          <FontAwesomeIcon icon={faSun} />
        ) : (
          <FontAwesomeIcon icon={faMoon} />
        )}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
