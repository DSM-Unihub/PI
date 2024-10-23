import mongoose from "mongoose"; // Importa o mongoose para interagir com o MongoDB

// Schema para funcionários associados a permissões
const FuncionarioSchema = new mongoose.Schema({
  referencia: { // Renomeado para dar mais clareza
    type: String,
    required: true, // Campo obrigatório
  },
  funcionarioId: { // Renomeado para melhorar a legibilidade
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Campo obrigatório
    ref: "Funcionario", // Referência ao modelo Funcionario
  },
});

// Schema principal para permissões
const PermissoesSchema = new mongoose.Schema({
  // Nome do grupo de permissões
  nomeGrupo: {
    type: String,
    required: true, // Campo obrigatório
    unique: true, // Garante que o nome do grupo seja único
  },
  // Lista de permissões associadas ao grupo
  permissoes: {
    type: [String],
    required: true, // Campo obrigatório
  },
  // Lista de funcionários associados ao grupo de permissões
  funcionarios: [FuncionarioSchema], // Array de funcionários utilizando o esquema FuncionarioSchema
}, { timestamps: true }); // Adiciona timestamps (createdAt e updatedAt)

// Criação do modelo Permissoes baseado no esquema PermissoesSchema
const Permissoes = mongoose.model("Permissoes", PermissoesSchema);

// Exporta o modelo Permissoes para uso em outros módulos
export default Permissoes;

