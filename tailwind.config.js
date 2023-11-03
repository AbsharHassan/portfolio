/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        customViolet: '#7c47eb',
        customIntermediate: '#8e72fc',
        customBlue: '#5a82f9',
        customAqua: '#09a9b8',
      },
    },
  },
  plugins: [],
}
