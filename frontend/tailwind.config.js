/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sky Blue Light Theme
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Custom brand colors
        brand: {
          primary: '#0ea5e9', // Sky 500
          secondary: '#6366f1', // Indigo 500
          accent: '#a855f7', // Purple 500
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        'gradient-accent': 'linear-gradient(135deg, #6366f1, #a855f7)',
        'gradient-success': 'linear-gradient(135deg, #22c55e, #10b981)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
