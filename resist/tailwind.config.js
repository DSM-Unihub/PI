/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/*.ejs'],
  theme: {
    extend: {
      colors:{
        "cinza-claro":"#E2E7F8",
        "azul-title": "#142A6C",
        "azul-text": "#2B438D",
        "cinza-border": "#CAD3ED",
        "azul-filtro":"#3063FF",
        "azul-principal":"#2D62FF"
      },
      borderWidth:{
        "5": "5em"
      },
    },
  },
  plugins: [],
}

