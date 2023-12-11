"use client"
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DarkModeSwitch() {
  const [isDark, setIsDark] = useState(false);

  // Determine and apply the initial theme on component mount
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem('theme');
    const darkModeOn = storedTheme === "dark" || (!storedTheme && prefersDarkMode);

    setIsDark(darkModeOn);
    updateTheme(darkModeOn);
  }, []);

  // Toggle the dark mode and update localStorage
  const toggleDarkMode = () => {
    const darkModeEnabled = !isDark;
    setIsDark(darkModeEnabled);
    updateTheme(darkModeEnabled);
    localStorage.setItem('theme', darkModeEnabled ? "dark" : "light");
  };

  // Update the class of the document element
  const updateTheme = (darkMode: boolean) => {
    document.documentElement.classList.toggle("dark", darkMode);
  }

  return (
    <div className="flex flex-row-reverse justify-between space-x-2 p-4">
      <label htmlFor="dark-mode-toggle" className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors duration-300 ${isDark ? "shadow-innerRing bg-white" : "bg-gray-800"}`}>
        <div className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-500 ${isDark ? "translate-x-6 bg-gray-800" : "bg-white"}`}></div>
      </label>
      <input
        id="dark-mode-toggle"
        type="checkbox"
        checked={isDark}
        onChange={toggleDarkMode}
        className="hidden"
      />
      <Link href="/" className="dark:text-gray-400 flex">
        <p>{`<`}</p>
        <p className="underline pl-2">Back to website</p>
      </Link>
    </div>
  );
}
