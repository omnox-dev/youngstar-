/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#a93200",
        "primary-container": "#d14307",
        "secondary": "#904d00",
        "secondary-container": "#fe932c",
        "tertiary": "#006b2c",
        "tertiary-container": "#00873a",
        "surface": "#fff8f6",
        "surface-container": "#ffe9e5",
        "surface-container-low": "#fff0ee",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#281714",
        "on-surface-variant": "#5a4139"
      },
      fontFamily: {
        headline: ["Noto Serif Devanagari", "serif"],
        body: ["Noto Sans Devanagari", "sans-serif"]
      }
    },
  },
  plugins: [],
}
