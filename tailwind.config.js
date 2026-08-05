/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'lantern-dark': '#0d0a05',
        'lantern-parchment': '#d4c5a9',
        'lantern-bronze': '#c97d3f',
        'lantern-gold': '#e8c34b',
        'lantern-ember': '#d94e3c',
        'lantern-moss': '#5b9a4e',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        'pixel-sans': ['"Pixelify Sans"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
