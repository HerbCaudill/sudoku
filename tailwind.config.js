import colors from 'tailwindcss/colors'

const mono = 'IBM Plex Mono'
const sans = 'IBM Plex Sans' // 'Libre Franklin Variable'
const condensed = 'IBM Plex Sans Condensed'
const serif = 'IBM Plex Serif'

const pink = {
  500: '#FAA6A4',
  600: '#E87E7E',
  700: '#FF3833',
  800: 'E20736',
}

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: [mono, 'monospace'],
        sans: [sans, 'sans-serif'],
        condensed: [condensed, 'sans-serif'],
        serif: [serif, 'serif'],
      },

      colors: {
        pink,
        primary: colors.blue,
        secondary: colors.teal,
        neutral: colors.gray,
        success: colors.green,
        warning: colors.orange,
        danger: colors.red,
      },

      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },

      keyframes: {
        highlight: {
          from: { backgroundColor: colors.blue[200] },
          to: { backgroundColor: colors.white },
        },
        contradiction: {
          from: { backgroundColor: colors.red[200] },
          to: { backgroundColor: colors.white },
        },
      },

      animation: {
        highlight: '1500ms highlight ease-out',
        contradiction: '1500ms contradiction ease-out',
      },
    },
  },
  plugins: [],
}
