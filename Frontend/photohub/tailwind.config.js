/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // Overwriting default slate to be a luxurious Dark Charcoal
        slate: {
          50: '#f8f8f8',
          100: '#e8e8e8',
          200: '#d3d3d3',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717', // Rich Charcoal
          900: '#0b0c10', // Deepest Charcoal/Black
          950: '#050507',
        },
        // Overwriting default amber to be a true Champagne/Metallic Gold
        amber: {
          50:  '#FDFBF7',
          100: '#F9F4E3',
          200: '#F3E5AB', // Champagne Gold
          300: '#EED57B',
          400: '#E8C547',
          500: '#D4AF37', // Metallic Gold Base
          600: '#B8962E',
          700: '#9C7D25',
          800: '#7F641D',
          900: '#634B14',
        },
        // Adding new accents
        maroon: {
          400: '#9E2A2B',
          500: '#780000', // Deep Maroon
          600: '#5c0000',
          900: '#330000',
        },
        royal: {
          500: '#C1121F', // Royal Red
          600: '#A30000',
        },
        beige: {
          500: '#F5F5DC', // Warm Beige
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
