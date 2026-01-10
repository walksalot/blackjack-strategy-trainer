/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          dark: '#0a2818',
          DEFAULT: '#0f3d26',
          light: '#1a5c3a',
        },
        gold: {
          dark: '#c5a600',
          DEFAULT: '#ffd700',
          light: '#ffe44d',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'flash-correct': 'flash-correct 0.3s ease-out',
        'flash-incorrect': 'flash-incorrect 0.3s ease-out',
        'deal': 'deal 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'flash-correct': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(34, 197, 94, 0.4)' },
        },
        'flash-incorrect': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.4)' },
        },
        'deal': {
          '0%': { opacity: '0', transform: 'translateY(-30px) rotate(-5deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
