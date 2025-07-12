/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1", // indigo-500
        },
        accent: {
          DEFAULT: "#a855f7", // purple-500
        },
      },
    },
  },
  plugins: [],
};
