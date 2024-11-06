import express from "express";
import indexacaoController from "../controllers/indexacaoController.js";

const router = express.Router();


// Rota para obter estatísticas de bloqueios por mês e por laboratório
router.get("/estatisticas-labs", indexacaoController.getEstatisticasBloqueios);
router.get("/ultimas-atividades", indexacaoController.getUltimasAtividades);

export default router;
