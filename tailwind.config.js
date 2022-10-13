/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/*.vue',
    './src/views/**/*.vue',
    './src/components/**/*.vue'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
