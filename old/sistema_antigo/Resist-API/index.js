import express from "express";
import cors from "cors"; 
import "./config/db-connection.js";
import indexacaoRoutes from "./routes/indexacaoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sugestaoRoutes from "./routes/sugestaoRoutes.js";


const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexacaoRoutes, userRoutes,sugestaoRoutes);

app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno no servidor" })
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
}).on("error", (error) => {
  console.error(`Erro ao iniciar o servidor: ${error}`);
});
