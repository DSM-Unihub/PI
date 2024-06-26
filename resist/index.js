import express from 'express';
import Auth from './middleware/Auth.js';
//import flash from 'express-flash'


const app = express();

import connection from './config/sequelize-config.js';
connection.authenticate().then(() => {
    console.log('Conexão com o banco de dados feita com sucesso!');
}).catch((error) => {
    console.log(error);
});

connection.query('CREATE DATABASE IF NOT EXISTS resistBD;').then(()=>{
    console.log('O Banco de dados está criado.')
}).catch((error)=>{
    console.log(error)
})

import userControllers from './controllers/userControllers.js';
import estatisticasControllers from './controllers/estatisticasControllers.js'
import bloqueiosControllers  from "./controllers/bloqueiosControllers.js"
import session, { Session } from 'express-session'
import { lab } from 'd3';
app.use(session({
    secret: "unihubResist",
    cookie: { maxAge: 28800000 },
    saveUninitialized: false,
    resave: false
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));


app.use("/", userControllers);
app.use("/", estatisticasControllers)
app.use("/", bloqueiosControllers)

app.get("/", Auth, async (req, res) => {
    const [labs] = await connection.query("SELECT * FROM labs")
        req.session.lab = labs.map(lab => ({
            labName: lab.laboratorio,
            acessosTotais: lab.total_acessos,
            percentAccess: parseFloat(lab.porcentagem_acessos).toFixed(2)
    })) 

    res.render("index",{
        usuario: req.session.user,
        Laboratorio: labs
        //messages: req.flash()
    })
})

app.listen(8080, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro!" + erro);
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});
