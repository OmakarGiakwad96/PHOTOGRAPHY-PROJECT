/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#15181C',
          800: '#1D2127',
          700: '#262B32'
        },
        paper: '#F6F2EA',
        brass: {
          DEFAULT: '#B9893E',
          light: '#D9AE6E',
          dark: '#8C6329'
        },
        teal: {
          DEFAULT: '#2E5D63',
          light: '#3F7B82'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(21,24,28,0.25)'
      }
    }
  },
  plugins: []
}
