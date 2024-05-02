/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Whitney', 'Open Sans', ...defaultTheme.fontFamily.sans],
        title: ['Ginto', 'Open Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: '#5865f2',
        'brand-560': '#4752C4',
        'brand-600': '#3C45A5',
        gray: {
          50: '#ECEDEE',
          100: '#DCDDDE',
          200: '#B9BBBE',
          300: '#8E9297',
          400: '#72767D',
          500: '#5C6067',
          550: '#4f545c',
          600: '#464950',
          700: '#36393F',
          800: '#2F3136',
          900: '#202225',
        },
        input: '#1e1f22',
        divider: 'hsla(0, 0%, 100%, 0.06)',
      },
      textColor: {
        'header-primary': '#f2f3f5',
        'header-secondary': '#b5bac1',
        link: '#00AFF4',
        hover: '#dcddde',
        muted: '#949ba4',
      },
      backgroundColor: {
        textarea: '#464950',
        'modifier-hover': 'rgba(79, 84, 92, 0.16)',
      },
      boxShadow: {
        msg: '0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
