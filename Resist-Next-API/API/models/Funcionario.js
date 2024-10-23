const mongoose = require('mongoose'); // Importa o mongoose para interagir com o MongoDB
const bcrypt = require('bcrypt'); // Importa o bcrypt para hashear senhas

// Define o esquema para o telefone
const telefoneSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true, // Campo obrigatório
    enum: ['residencial', 'comercial', 'celular'], // Valores permitidos
  },
  numero: {
    type: String,
    required: true, // Campo obrigatório
    unique: true, // Garante que cada número de telefone seja único
    validate: {
      validator: function(v) {
        // Valida que o número de telefone tem entre 10 a 15 dígitos
        return /\d{10,15}/.test(v);
      },
      message: props => `${props.value} não é um número de telefone válido!`, // Mensagem de erro personalizada
    },
  },
});

// Define o esquema para o funcionário
const funcionarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true, // Campo obrigatório
    trim: true, // Remove espaços em branco no início e no fim
  },
  sobrenome: {
    type: String,
    required: true, // Campo obrigatório
    trim: true, // Remove espaços em branco no início e no fim
  },
  email: {
    type: String,
    required: true, // Campo obrigatório
    unique: true, // Garante que cada e-mail seja único
    lowercase: true, // Converte o e-mail para minúsculas
    validate: {
      // Validação mais robusta para e-mail pode ser implementada aqui
    },
  },
  senha: {
    type: String,
    required: true, // Campo obrigatório
  },
  telefones: [telefoneSchema], // Array de telefones usando o telefoneSchema
  dataNascimento: {
    type: Date // Campo opcional para a data de nascimento
  },
  ativo: {
    type: Boolean,
    default: true // Define que o funcionário está ativo por padrão
  }
}, { timestamps: true }); // Adiciona timestamps (createdAt e updatedAt)

// Virtual para nome completo
funcionarioSchema.virtual('nomeCompleto').get(function() {
  return `${this.nome} ${this.sobrenome}`; // Retorna o nome completo concatenado
});

// Antes de salvar o documento, hashea a senha
funcionarioSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10); // Gera um salt para o hash
  this.senha = await bcrypt.hash(this.senha, salt); // Hashea a senha
  next(); // Continua para o próximo middleware
});

// Índice composto para busca por nome e email
funcionarioSchema.index({ nome: 1, email: 1 });

// Cria o modelo Funcionario baseado no funcionarioSchema
const Funcionario = mongoose.model('Funcionario', funcionarioSchema);

// Exporta o modelo Funcionario para uso em outros módulos
module.exports = Funcionario;
