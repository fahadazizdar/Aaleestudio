/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7f5',
          100: '#f5eee9',
          200: '#ebdace',
          300: '#ddbea9',
          400: '#cd9a80',
          500: '#bd7b5e',
          600: '#ad644a',
          700: '#8f4f3c',
          800: '#754335',
          900: '#60392f',
          950: '#341c17',
        },
        accent: {
          gold: '#D4AF37',
          rose: '#E8B4B8',
          maroon: '#6B1D2F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
}
