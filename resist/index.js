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
import configControllers from './controllers/configControllers.js';
import estatisticasControllers from './controllers/estatisticasControllers.js'

import session, { Session } from 'express-session'
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
app.use("/", configControllers);
app.use("/", estatisticasControllers)


app.get("/", Auth, async (req, res) => {
    res.render("index",{
        usuario: req.session.user
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
