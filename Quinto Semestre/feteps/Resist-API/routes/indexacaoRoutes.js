import express from "express";
import indexacaoController from "../controllers/indexacaoController.js";
import Auth, { authorizeRoles } from '../middleware/Auth.js'

const router = express.Router();

// Rota para obter estatísticas de bloqueios por mês e por laboratório
router.get("/estatisticas-labs", Auth, authorizeRoles(1), indexacaoController.getEstatisticasLabs);

router.get("/estatisticas-mes", Auth, authorizeRoles(1), indexacaoController.getEstatisticasBloqueios);

router.get("/ultimas-atividades", Auth, authorizeRoles(1), indexacaoController.getUltimasAtividades);

router.get("/bloqueios-mes", Auth, authorizeRoles(1), indexacaoController.getBloqueiosPorMes)

router.get("/bloqueios", authorizeRoles(1), Auth, indexacaoController.getAllBlocks);

router.get("/bloqueios/url/:url", authorizeRoles(1), Auth, indexacaoController.getIndexacaoByUrl);

router.post("/bloqueios", Auth, authorizeRoles(1), indexacaoController.createBlock);

router.put("/bloqueios/:id", Auth, authorizeRoles(1), indexacaoController.updateBlock);

router.delete("/bloqueios/:id", Auth, authorizeRoles(1), indexacaoController.deleteBlock);

export default router;
