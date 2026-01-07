/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        yellow: {
          400: '#FACC15',
          500: '#FACC15',
        },
        fuchsia: {
          500: '#D946EF',
        },
      },
    },
  },
  plugins: [],
}
