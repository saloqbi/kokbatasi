/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      colors: {
        dark: "#121212",
        panel: "#1a1a1a",
        accent: "#facc15",
      },
    },
  },
  plugins: [],
}
