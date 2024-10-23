import mongoose from "mongoose"; // Importa o mongoose para interagir com o MongoDB

// Schema para indexação
const IndexSchema = new mongoose.Schema({
  // IP da máquina que fez o acesso
  ipMaquina: {
    type: String,
    required: true, // Campo obrigatório
  },
  // URL acessada
  urlWeb: {
    type: String,
    required: true, // Campo obrigatório
  },
  // Data e hora do acesso
  dataHora: {
    type: Date,
    default: Date.now, // Define a data/hora atual como padrão
  },
  // Flag para indicar se o acesso foi bloqueado
  flag: {
    type: Boolean,
    default: false, // Define que o acesso não está bloqueado por padrão
  }
}, { timestamps: true }); // Adiciona campos de timestamps (createdAt e updatedAt)

// Criação do modelo Indexacao baseado no schema
const Indexacao = mongoose.model("Indexacao", IndexSchema);

// Exporta o modelo Indexacao para uso em outros módulos
export default Indexacao;
