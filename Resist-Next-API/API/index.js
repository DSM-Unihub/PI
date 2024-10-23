import express from "express"; // Importa o módulo express
import "./config/db-connection.js"; // Importa a configuração de conexão com o MongoDB
import userRoutes from "./routes/userRoutes.js"; // Importa as rotas de usuário
import funcionariosRoutes from "./routes/funcionariosRoutes.js"; // Importa as rotas de funcionários

// Inicializa o aplicativo Express
const app = express();

// Middleware para interpretar dados JSON
app.use(express.json());
// Middleware para interpretar dados de formulários URL-encoded
app.use(express.urlencoded({ extended: true }));

// Define as rotas da API sob o prefixo "/api"
app.use("/api", userRoutes, funcionariosRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error("Erro não tratado:", err); // Log do erro no console
    res.status(500).json({ error: "Erro interno no servidor" }); // Responde com um erro 500 em formato JSON
});

// Configuração e inicialização do servidor
const PORT = process.env.PORT || 4000; // Define a porta do servidor, usando a variável de ambiente ou padrão 4000
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`); // Log de sucesso ao iniciar o servidor
}).on("error", (error) => {
    console.error(`Erro ao iniciar o servidor: ${error}`); // Log de erro ao iniciar o servidor
});
