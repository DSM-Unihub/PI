import express from "express";
import indexacaoController from "../controllers/indexacaoController.js";

const router = express.Router();


// Rota para obter estatísticas de bloqueios por mês e por laboratório
router.get("/estatisticas-labs", indexacaoController.getEstatisticasLabs);
router.get("/estatisticas-mes", indexacaoController.getEstatisticasBloqueios);
router.get("/ultimas-atividades", indexacaoController.getUltimasAtividades);
router.get("/bloqueios-mes", indexacaoController.getBloqueiosPorMes)
router.get("/bloqueios", indexacaoController.getAllBlocks);
export default router;
