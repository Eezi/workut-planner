/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        main: '#0f141b',
        grey: '#182027'
      }
    },
  },
  daisyui: {
    themes: ["light", "dark", "night",
    {
      nightblue: {
        primary: "#111322",
      }
    }
    ],
  },
  plugins: [require("daisyui")],
};
