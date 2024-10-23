import express from "express";
import instituicaoController from "../controllers/instituicaoController.js";
import Auth from "../middleware/Auth.js";

const router = express.Router();

// Rota para obter todas as instituições
router.get("/instituicoes", Auth.Authorization, instituicaoController.getAllInstituicoes);

// Rota para obter uma instituição por ID
router.get("/instituicoes/:id", Auth.Authorization, instituicaoController.getOneInstituicao);

// Rota para criar uma nova instituição
router.post("/instituicoes", Auth.Authorization, instituicaoController.createInstituicao);

// Rota para atualizar uma instituição existente
router.put("/instituicoes/:id", Auth.Authorization, instituicaoController.updateInstituicao);

// Rota para deletar uma instituição
router.delete("/instituicoes/:id", Auth.Authorization, instituicaoController.deleteInstituicao);

export default router;
