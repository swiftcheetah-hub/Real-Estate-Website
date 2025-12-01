/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fbbf24',
          dark: '#f59e0b',
          light: '#fcd34d',
        },
        secondary: {
          DEFAULT: '#000000',
          light: '#1a1a1a',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          light: '#1a1a1a',
          lighter: '#2a2a2a',
        }
      },
    },
  },
  plugins: [],
}


