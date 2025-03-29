/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // Ensure Next.js App Router support
  ],
  darkMode: "class", // Enable dark mode using class
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Blue
        secondary: "#1E40AF", // Darker Blue
        darkBg: "#111827", // Dark mode background
        darkText: "#E5E7EB", // Light text for dark mode
      },
      boxShadow: {
        glass: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
