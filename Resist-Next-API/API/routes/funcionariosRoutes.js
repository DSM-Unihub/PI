import express from "express";
import funcionarioController from "../controllers/funcionarioController.js";
import Auth from "../middleware/Auth.js";

const router = express.Router();

// Middleware para verificar a autorização em todas as rotas de funcionários
router.use(Auth.Authorization);

// Rota para buscar todos os funcionários
router.get("/funcionarios", funcionarioController.getAllFuncionarios);

// Rota para buscar um funcionário específico por ID
router.get("/funcionarios/:id", funcionarioController.getOneFuncionario);

// Rota para criar um novo funcionário
router.post("/funcionarios", funcionarioController.createFuncionario);

// Rota para atualizar um funcionário existente
router.put("/funcionarios/:id", funcionarioController.updateFuncionario);

// Rota para deletar um funcionário
router.delete("/funcionarios/:id", funcionarioController.deleteFuncionario);

export default router;
