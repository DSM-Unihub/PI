// Importa o mongoose para interagir com o MongoDB
import mongoose from "mongoose";
// Importa o dotenv para carregar variáveis de ambiente
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Obtém as credenciais do banco de dados das variáveis de ambiente
const { DB_PASS, DB_NAME, DB_USER } = process.env;

// Função assíncrona para conectar ao MongoDB
const connect = async () => {
  try {
    // Constrói a string de conexão
    const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@auladw3.qpo0l.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=AulaDW3`;
    
    // Tenta conectar ao MongoDB
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
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
