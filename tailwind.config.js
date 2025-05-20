/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0B0B',
          800: '#0F0F0F',
          700: '#1A1A1A',
          600: '#2A2A2A',
          500: '#3A3A3A',
          400: '#4A4A4A',
        },
        accent: {
          primary: '#FF8C00',
          'primary-dark': '#E57D00',
          secondary: '#4A90E2',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(255, 140, 0, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(255, 140, 0, 0.5)' },
        },
      },
    },
  },
  plugins: [],
} 