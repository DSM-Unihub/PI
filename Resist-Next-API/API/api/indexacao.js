import connectDB from "../config/db-connection.js";
import express from "express";
import indexacaoController from "../controllers/indexacaoController.js";
import Auth from "../middleware/Auth.js";

const app = express();
app.use(express.json());

app.get("/estatisticas-labs", Auth, indexacaoController.getEstatisticasLabs);
app.get("/estatisticas-mes", Auth, indexacaoController.getEstatisticasBloqueios);
app.get("/ultimas-atividades", Auth, indexacaoController.getUltimasAtividades);
app.get("/bloqueios-mes", Auth, indexacaoController.getBloqueiosPorMes);
app.get("/bloqueios", Auth, indexacaoController.getAllBlocks);
app.post("/bloqueios", Auth, indexacaoController.createBlock);
app.put("/bloqueios/:id", Auth, indexacaoController.updateBlock);
app.delete("/bloqueios/:id", Auth, indexacaoController.deleteBlock);

export default async (req, res) => {
  await connectDB(); // Garante a conexão com o banco de dados
  return app(req, res); // Encaminha a solicitação para o Express
};
