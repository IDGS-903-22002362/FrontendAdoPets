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
          DEFAULT: '#2B6CB0',
          dark: '#0A2540',
          light: '#87CEFA',
        },
      },
    },
  },
  plugins: [],
}
