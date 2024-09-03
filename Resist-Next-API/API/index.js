import express from "express";
import mongoose from "./config/db-connection.js";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", rota)

const port = 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(`Erro: ${error}`);
  }
  console.log(`API Rodando em http://localhost:${port}`);
});
