import express from "express";
import {  getEstatisticasBloqueios } from "../controllers/indexacaoController.js";

const router = express.Router();

// Rota para obter estatísticas de bloqueios por mês e por laboratório
router.get("/bloqueios-estatisticas", getEstatisticasBloqueios);

export default router;
