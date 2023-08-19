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
        nightforest: {
          "primary": "#06dc83",
          "secondary": "#D926AA",
          "accent": "#8b5cf6",
          "neutral": "#18181b",
          "base-100": "#0c0c0c",
          "borderColor": "#27272a",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",

          ".card-border": {
            "border": "1px solid #27272a",

          },
        }
      }
    ],
  },
  plugins: [require("daisyui")],
};
