/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kahra_deep: "#ffffffff",
        kahra_gold: "#b88746",
        kahra_goldSoft: "#f9d423",
        kahra_cream: "#fdf5a6",
      },
      boxShadow: {
        "soft-xl": "0 18px 50px rgba(0,0,0,0.18)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
      keyframes: {
        "hero-fade-1": {
          "0%, 45%": { opacity: "1" },
          "55%, 100%": { opacity: "0" },
        },
        "hero-fade-2": {
          "0%, 45%": { opacity: "0" },
          "55%, 100%": { opacity: "1" },
        },
      },
      animation: {
        "hero-fade-1": "hero-fade-1 12s ease-in-out infinite",
        "hero-fade-2": "hero-fade-2 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};