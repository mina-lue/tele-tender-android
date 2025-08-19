/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors :{
        primary: '#22734B',
        background: '#003C24',
        backgroundSec: '#22734B',
      }
    },
  },
  plugins: [],
}