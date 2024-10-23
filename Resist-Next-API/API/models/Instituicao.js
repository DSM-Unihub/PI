import mongoose from "mongoose"; // Importa o mongoose para interagir com o MongoDB

// Define o esquema para funcionários
const FuncionarioSchema = new mongoose.Schema({
  // Referência a algum recurso
  referencia: {
    type: String,
    required: true, // Campo obrigatório
  },
  // Object ID para utilizar o ID gerado pelo MongoDB
  funcionarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Campo obrigatório
    ref: "Funcionario", // Referência ao modelo Funcionario
  },
});

// Define o esquema para instituições
const InstituicaoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true, // Campo obrigatório
    trim: true, // Remove espaços em branco no início e no fim
  },
  cnpj: {
    type: String,
    required: true, // Campo obrigatório
    unique: true, // Garante que o CNPJ seja único
    validate: {
      validator: function(v) {
        // Validação para garantir que o CNPJ tenha 14 dígitos
        return /\d{14}/.test(v);
      },
      message: props => `${props.value} não é um CNPJ válido!`, // Mensagem de erro personalizada
    },
  },
  funcionarios: [FuncionarioSchema], // Array de funcionários utilizando o esquema de funcionários
}, { timestamps: true }); // Adiciona timestamps (createdAt e updatedAt)

// Cria o modelo Instituicoes baseado no esquema InstituicaoSchema
const Instituicoes = mongoose.model("Instituicoes", InstituicaoSchema);

// Exporta o modelo Instituicoes para uso em outros módulos
export default Instituicoes;
