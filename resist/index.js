import express from 'express';
import connection from './config/sequelize-config.js';
import Auth from './middleware/Auth.js';
import userControllers from './controllers/userControllers.js';
import configControllers from './controllers/configControllers.js';
import session from 'express-session';
import axios from 'axios';

const app = express();

connection.authenticate().then(() => {
    console.log('Conexão com o banco de dados feita com sucesso!');
}).catch((error) => {
    console.log(error);
});

app.use(session({
    secret: "unihubResist",
    cookie: { maxAge: 28800000 },
    saveUninitialized: false,
    resave: false
}));

app.set('view engine', 'ejs');
app.set('views', './views'); // Certifique-se de que o diretório de views está configurado
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use("/", userControllers);
app.use("/", configControllers);

app.get("/", Auth, async (req, res) => {
    res.render("index",{
        
    })

})

app.listen(8080, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro!" + erro);
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});
