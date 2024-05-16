/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/*.ejs'],
  theme: {
    extend: {
      colors:{
        "cinza-claro":"#E2E7F8"
      },
      borderWidth:{
        "5": "5em"
      }
    },
  },
  plugins: [],
}

