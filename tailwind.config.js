/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-bg': '#0a0a1a',
        'retro-surface': '#12122a',
        'retro-border': '#2a2a4a',
        'retro-gold': '#ffd700',
        'retro-cyan': '#00ffff',
        'retro-magenta': '#ff00ff',
        'retro-green': '#00ff66',
        'retro-red': '#ff3333',
        'retro-orange': '#ff8800',
        'retro-text': '#e0e0e0',
        'retro-dim': '#666688',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
