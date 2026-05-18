import mongoose from "mongoose";

const fraseSchema = new mongoose.Schema(
  {
    texto: { type: String, required: true },
    ofensiva: { type: Boolean, default: true },
    categoria: { type: String, default: null },
  },
  { _id: false }
);

const indexacaoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  urlWeb: { type: String },
  motivo: { type: String },
  frases: { type: [fraseSchema], default: [] },
  periodo: { type: String },
  tipoInsercao: { type: String },
  ipMaquina: { type: String },
  dataHora: { type: Date, default: Date.now },
  flag: { type: Boolean, default: true },
  /** true = bloqueio manual total (app); false = indexação automática do proxy */
  bloqueioTotal: { type: Boolean, default: false },
});

const Indexacao = mongoose.model("Indexacoes", indexacaoSchema);

export default Indexacao;
