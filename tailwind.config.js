/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./de/*.html",
    "./components/*.html",
    "./js/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'geist': ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'geist-mono': ['Geist Mono', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.8s ease-out forwards'
      }
    },
  },
  plugins: [],
}
