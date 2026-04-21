/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#080d1f',
          light: '#0d1530',
        },
        blue:  { DEFAULT: '#4f8ef7' },
        purple:{ DEFAULT: '#9b5de5' },
        green: { DEFAULT: '#00b94a' },
        red:   { DEFAULT: '#ff3b3b' },
        amber: { DEFAULT: '#f59e0b' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(79,142,247,0.4)',
        'glow-green': '0 0 20px rgba(0,185,74,0.4)',
        'glow-red':   '0 0 20px rgba(255,59,59,0.4)',
      },
    },
  },
  plugins: [],
};
