import express from "express";
import indexacaoController from "../controllers/indexacaoController.js";
import Auth from '../middleware/Auth.js'

const router = express.Router();


// Rota para obter estatísticas de bloqueios por mês e por laboratório
router.get("/estatisticas-labs", Auth, indexacaoController.getEstatisticasLabs);

router.get("/estatisticas-mes", Auth, indexacaoController.getEstatisticasBloqueios);

router.get("/ultimas-atividades", Auth, indexacaoController.getUltimasAtividades);

router.get("/bloqueios-mes", Auth, indexacaoController.getBloqueiosPorMes)

router.get("/bloqueios", Auth, indexacaoController.getAllBlocks);

router.post("/bloqueios", Auth, indexacaoController.createBlock);

router.put("/bloqueios/:id", Auth, indexacaoController.updateBlock);

router.delete("/bloqueios/:id", Auth, indexacaoController.deleteBlock);
export default router;
