import { Router } from "express";
import indexController from "../controllers/indexController.js";
import Auth from "../middleware/Auth.js"; // Middleware de autorização

const router = Router();

// Middleware para verificar a autorização em todas as rotas de indexação
router.use(Auth.Authorization);

// Rota para obter todas as indexações
router.get("/", indexController.getAllIndex);

// Rota para obter estatísticas de acessos por mês
router.get("/acessos-por-mes", indexController.getAcessosPorMes);

// Rota para obter estatísticas de acessos por laboratório
router.get("/acessos-por-laboratorio/:laboratorio", indexController.getAcessosPorLaboratorio);

// Rota para obter estatísticas de acessos por intervalo de datas
router.get("/acessos-por-data/:dataInicial/:dataFinal", indexController.getAcessosPorData);

export default router;
