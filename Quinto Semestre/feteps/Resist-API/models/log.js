import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    acao: { type: String, required: true },
    dataHora: { type: Date, default: Date.now },
    autor: { type: String, required: true }, //idUser
    alvo: { type: String, required: true }, 
    justificativa: { type: String } //opcional, por padrao sera nulo e alteravel dps no sistema
})

const Log = mongoose.model("Logs", logSchema);

export default Log;

//devem ser logados create/update/delete de blocks (indexacoes) e aceitacao/recusa de sugestoes