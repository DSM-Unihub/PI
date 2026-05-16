/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        "cinza-claro":"#E2E7F8",
        "azul-title": "#142A6C",
        "block-MBG":"#E3E8F8",
        "azul-cinza-escuro":"#47578c",
        "azul-MBT":"#7784ae",
        "azul-text": "#2B438D",
        "azul-LMT":"#4A71E4",
        "cinza-border": "#CAD3ED",
        "azul-filtro":"#3063FF",
        "azul-principal":"#2D62FF",
        "azul-cinza-claro":"#94A2CB",
        "cinza-principal": "#CCD5F0",
        "cinza-secundario": "#F1EFFC",
        "cinza-CM":"#8E9ECC",
        "cinza-gradiente-final":"#EBEFFB",
        "cinza-gradiente-inicio": "#D7E1FF",
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
        '100':"38rem",
        "42": "10.06rem"
      }
    },
  },
  plugins: [],
};
