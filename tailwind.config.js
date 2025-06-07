// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Добавляем поддержку темной темы
  theme: {
    extend: {},
  },
  plugins: [],
}
