import mongoose from "mongoose";

const funcionariosSchema = new mongoose.Schema({
  $ref: String,
  $_id: mongoose.Schema.Types.ObjectId, //Object ID para utilizar o id gerado pelo mongodb
});

const InstituicoesSchema = new mongoose.Schema({
  nome: String,
  cnpj: String,
  funcionarios: [funcionariosSchema],
});

const Instituicoes = mongoose.model("Instituicoes", InstituicoesSchema);

export default Instituicoes;
