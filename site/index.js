// Importa o express
const express = require("express")
// Inicia o Express na variavel app
const app = express()
// Define o EJS para renderizar paginas HTML
app.set('view engine', 'ejs')
app.use(express.static('views'));



// Renderiza a Pagina Index
app.get("/", (req, res)=>{
    res.render('index')
})

// Inicia o Servidor
app.listen(8080, function(erro){
    if(erro){
        console.error(erro);
    }else{
        console.log("Servidor Iniciado!!")
    }
})