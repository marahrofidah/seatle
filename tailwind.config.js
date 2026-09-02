/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        turtle: {
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          accent: '#38bdf8',
        }
      }
    },
  },
  plugins: [],
}