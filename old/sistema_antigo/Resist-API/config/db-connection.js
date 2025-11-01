// Importa o mongoose para interagir com o MongoDB
import mongoose from "mongoose";
// Importa o dotenv para carregar variáveis de ambiente
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Obtém as credenciais do banco de dados das variáveis de ambiente
const mongoDBURI = "mongodb://127.0.0.1:27017/PI";

// Função assíncrona para conectar ao MongoDB
const connect = async () => {
  try {
    // Tenta conectar ao MongoDB usando a URI das variáveis de ambiente
    await mongoose.connect(mongoDBURI);
    
    console.log("Conectado ao MongoDB com sucesso");
  } catch (error) {
    console.error(`Erro ao se conectar com o MongoDB: ${error}`);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

// Inicia a conexão com o banco de dados
connect();

// Exporta o mongoose para uso em outros módulos
export default mongoose;
