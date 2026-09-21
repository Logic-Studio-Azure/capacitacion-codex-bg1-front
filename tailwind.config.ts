import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182238',
        muted: '#515A73',
        magenta: '#A80058',
        accent: '#D2006E',
        canvas: '#F5F6F8',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
