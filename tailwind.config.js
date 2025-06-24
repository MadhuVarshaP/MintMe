/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f6f4d3",
        foreground: "#2d2d2d",
        primary: "#2d2d2d",
        "body-text": "#2d2d2d",
        "text-dark": "#2d2d2d",
        "gray-light": "#f8f9fa",
        "gray-medium": "#6c757d",
      },
      backgroundColor: {
        DEFAULT: "#f6f4d3",
      },
      textColor: {
        DEFAULT: "#2d2d2d",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-bricolage-grotesque)", "Bricolage Grotesque", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
