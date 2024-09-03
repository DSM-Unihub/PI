import mongoose from "mongoose";

const telefoneSchema = new mongoose.Schema({
  tipo: String,
  numero: Number,
});

const emailsSchema = mongoose.Schema({
  institucional: String,
  pessoal: String,
});

const FuncionarioSchema = new mongoose.Schema({
  nome: String,
  emails: [emailsSchema],
  senha: String,
  telefones: [telefoneSchema],
  foto: String,
});

const Funcionarios = mongoose.model("Funcionarios", FuncionarioSchema);

export default Funcionarios;
