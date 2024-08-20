import express, { urlencoded } from "express";
import mongoose from "mongoose";

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/resistdb");

app.use(express.urlencoded({ extended: false }));
app.use(express.json);

const port = 4000

app.listen(port, (error) =>{
    if(error){
        console.log(`Não foi possivel se conectar, erro: ${error}`)
    }
    else{
        console.log(`Conectado na porta ${port}`)
    }
})