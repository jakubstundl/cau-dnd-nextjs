/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'grand-hotel': ['"Grand Hotel"', 'san-serif'],
        'LOTR' : ["LOTR", 'sans-serif']
      },
    }
  },
  plugins: [],
};