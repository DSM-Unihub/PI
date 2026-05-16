import mongoose from "mongoose";

const instituicaoSchema = mongoose.Schema({
    nome:{type: String, required: true},
    cnpj:{type: String, required: true},
    conexao:{type: String, required: true}
})

const userSchema = new mongoose.Schema({
    nome:{type: String, required: true},
    email:{type: String, required: true},
    senha:{type: String, required: true},
    telefone:{type: String},
    foto:{type: String},
    instituicao: instituicaoSchema,
    permissoes: [{type: String}]
})

const User = mongoose.model('funcionario', userSchema)

export default User;