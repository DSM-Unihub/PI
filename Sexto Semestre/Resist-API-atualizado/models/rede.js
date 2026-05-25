import mongoose from "mongoose";

const redeSchema = new mongoose.Schema({
  dataHora: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  ipStart: { type: String, required: true },
  ipEnd: { type: String, required: true },
  nome: { type: String, required: true },
});

const Rede = mongoose.model("rede", redeSchema);

export default Rede;
