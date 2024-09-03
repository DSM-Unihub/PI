import mongoose from "mongoose";

const funcionariosSchema = new mongoose.Schema({
  $ref: String,
  $_id: mongoose.Schema.Types.ObjectId, //Object ID para utilizar o id gerado pelo mongodb
});

const PermissoesSchema = new mongoose.Schema({
  nomeGrupo: String,
  permissoes: [String],
  funcionarios: [funcionariosSchema],
});

const Permissoes = mongoose.model("Permissoes", PermissoesSchema);

export default Permissoes;
