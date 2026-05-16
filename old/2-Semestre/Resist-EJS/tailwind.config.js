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
        "laranja-e": "#F34822",
        "azul-gradiente-final":"#4571F9" ,
        "azul-gradiente-inicio":'#2D60FC',
        "azul-login-inicio":"#0174FE",
        "azul-login-fim":"#0040ED",
        "cinza":"#F9F9F9",
        "red-status":"#F86B6B",
        "cinza-bg-bloq":"#1A1A1A",
        "azul-nav-fim": "#234DCB",
        "azul-buttom":"#2653db"
      },
      borderWidth:{
        "5": "5em"
      },
      width:{
        '720':'720px'
      },
      maxHeight:{
        '100':"38rem"
      }
    },
  },
  plugins: [],
}

