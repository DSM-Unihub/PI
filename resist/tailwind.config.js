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
        "azul-principal":"#2D62FF",
        "azul-cinza-claro":"#94A2CB",
        "cinza-principal": "#CCD5F0",
        "cinza-secundario": "#F1EFFC",
        "laranja-s": "#FD6A4B",
        "laranka-e": "#F34822"
      },
      borderWidth:{
        "5": "5em"
      },
      width:{
        '720':'720px'
      },
    },
  },
  plugins: [],
}

