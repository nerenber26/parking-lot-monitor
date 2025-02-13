/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#1E1656",
          secondary: "#5E6A71",
        },
      },
    },
    plugins: [],
  };