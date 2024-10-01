import mongoose from "mongoose";

const telefoneSchema = new mongoose.Schema({
  tipo: String,
  numero: Number,
});

const FuncionarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  telefones: [telefoneSchema],
  foto: String,
});

const Funcionarios = mongoose.model("Funcionarios", FuncionarioSchema);

export default Funcionarios;
