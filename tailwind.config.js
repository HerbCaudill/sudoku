import colors from 'tailwindcss/colors'

const mono = 'IBM Plex Mono'
const sans = 'IBM Plex Sans' // 'Libre Franklin Variable'
const condensed = 'IBM Plex Sans Condensed'
const serif = 'IBM Plex Serif'

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
        primary: colors.blue,
        secondary: colors.teal,
        neutral: colors.stone,
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
