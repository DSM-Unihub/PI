import mongoose from "mongoose";

const indexacaoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  urlWeb: { type: String },
  motivo: { type: String },
  periodo: { type: String },
  tipoInsercao: { type: String },
  ipMaquina: { type: String },
  dataHora: { type: Date, default: Date.now },
  flag: { type: Boolean, default: true }
});

const Indexacao = mongoose.model("Indexacoes", indexacaoSchema);

export default Indexacao;
