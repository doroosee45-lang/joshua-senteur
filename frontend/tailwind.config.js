/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          950: '#14100F',
          900: '#1C1615',
          800: '#241C1A',
          700: '#2C2423',
          600: '#3A302E',
          500: '#5A4E4C',
        },
        roselle: {
          blush: '#E2C0BC',
          champagne: '#D4B8AE',
          rosewood: '#9E6B6B',
          deep: '#8A5A5A',
          gold: '#B08D57',
        },
        ivory: {
          50: '#FCFAFA',
          100: '#FAF8F4',
          200: '#F5EDE8',
          300: '#EAE4E1',
          400: '#E5DCD9',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', '"Cormorant Garamond"', 'cursive'],
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        petalFall: {
          '0%': {
            transform: 'translate3d(0, -10%, 0) rotate(0deg) scale(0.9)',
            opacity: '0',
          },
          '15%': {
            opacity: '0.85',
          },
          '85%': {
            opacity: '0.75',
          },
          '100%': {
            transform: 'translate3d(80px, 110vh, 0) rotate(320deg) scale(1.05)',
            opacity: '0',
          },
        },
        petalFloatSlow: {
          '0%, 100%': {
            transform: 'translate3d(0, 0, 0) rotate(0deg)',
          },
          '50%': {
            transform: 'translate3d(14px, -16px, 0) rotate(18deg)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(18px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slowZoom: {
          '0%': {
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(1.06)',
          },
        },
      },
      animation: {
        'petal-fall': 'petalFall 16s linear infinite',
        'petal-float': 'petalFloatSlow 7s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slow-zoom': 'slowZoom 12s ease-out forwards',
      },
    },
  },
  plugins: [],
};
