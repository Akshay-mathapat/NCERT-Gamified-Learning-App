/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        secondary: '#ec4899',
        accent: '#8b5cf6',
        surface: 'rgba(255, 255, 255, 0.05)',
        'surface-border': 'rgba(255, 255, 255, 0.1)',
        'math-color': '#3b82f6',
        'science-color': '#10b981',
      }
    },
  },
  plugins: [],
}
