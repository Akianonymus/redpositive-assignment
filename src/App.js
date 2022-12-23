import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Navbar from "./Navbar";

function App() {
  const [darkMode, setDarkMode] = useState(null);

  // update local storage when theme changes
  useMemo(() => {
    if (darkMode !== null)
      if (darkMode)
        // Whenever the user explicitly chooses dark mode
        localStorage.theme = "dark";
      // Whenever the user explicitly chooses light mode
      else localStorage.theme = "light";
  }, [darkMode]);

  // if theme var found in localStorage then use it
  // otherwise check prefers-color-scheme
  useMemo(() => {
    if (
      localStorage.theme === "dark" ||
      ((localStorage?.theme !== "light" || !("theme" in localStorage)) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDarkMode(true);
      localStorage.theme = "dark";
    } else {
      setDarkMode(false);
      localStorage.theme = "light";
    }
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white min-h-screen text-sky-900 dark:text-sky-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="sticky top-0 backdrop-blur">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
