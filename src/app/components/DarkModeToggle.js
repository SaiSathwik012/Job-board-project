"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <button
            className="p-2 rounded-lg bg-gray-300 dark:bg-gray-800 dark:text-white"
            onClick={() => setDarkMode(!darkMode)}
        >
            {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
    );
}
