import mongoose from "mongoose";

const instituicaoSchema = mongoose.Schema({
    nome:{type: String},
    cnpj:{type: String},
    conexao:{type: String}
})

const userSchema = new mongoose.Schema({
    nome:{type: String, required: true},
    email:{type: String, required: true},
    senha:{type: String, required: true},
    telefone:{type: String},
    foto:{type: String},
    instituicao: {instituicaoSchema},
    permissoes: [{type: String}],
})

const User = mongoose.model('funcionario', userSchema)

export default User;