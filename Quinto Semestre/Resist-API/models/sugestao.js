import mongoose from "mongoose";

const sugestaoSchema = new mongoose.Schema({
    idUser: { type: String, required: true }, // Corrigido aqui
    dataHora: { type: Date, default: Date.now },
    url: { type: String, required: true },
    motivo: { type: String, required: true },
    tipo: { type: Boolean, required: true }, // true para bloqueio, false para desbloqueio
    situacao: { 
        type: String, 
        required: true,
        enum: ['Pendente', 'Aceito', 'Recusado'],
        default: 'Pendente'
    },
    foto: { type: String },
})

const Sugestao = mongoose.model('sugestoes', sugestaoSchema);

export default Sugestao;
