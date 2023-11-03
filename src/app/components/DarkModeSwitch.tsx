'use client'

import { useEffect, useState } from "react";

export default function DartModeSwitch() {
  const [isDark, setIsDark] = useState(false);

  // on component mount, determine the initial theme
  useEffect(() => {
    const darkModeOn =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(darkModeOn);
    if (darkModeOn) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleDarkMode() {
    const darkModeEnabled = !isDark;
    setIsDark(darkModeEnabled);

    if (darkModeEnabled) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }

  return (
    <div className="flex flex-row-reverse space-x-2 p-4">
      <input
        id="btn"
        type="checkbox"
        checked={isDark}
        onChange={toggleDarkMode}
        className="hidden"
      />
      <label
        htmlFor="btn"
        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
          isDark ? "bg-white shadow-innerRing" : "bg-gray-800"
        }`}
      >
        <div
          className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-500 ${
            isDark ? "translate-x-6 bg-gray-800" : "bg-white"
          }`}
        ></div>
      </label>
    </div>
  );
}
