const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        "isw-purple": "#211C6A",
        "isw-blue": "#59B4C3",
        "isw-green": "#74E291",
        "isw-yellow": "#EFF396",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
