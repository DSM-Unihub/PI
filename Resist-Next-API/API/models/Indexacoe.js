import mongoose from "mongoose";

const IndexSchema = new mongoose.Schema({
  pathLocal: String,
  flag: Boolean,
  urlWeb: String,
  termo: String,
  dataHora: Date,
  ipMaquina: String,
});

const Indexacoes = mongoose.model("Indexacoes", IndexSchema);

export default Indexacoes;
