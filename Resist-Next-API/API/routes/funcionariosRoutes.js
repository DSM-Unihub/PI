import express from "express"
import funcionarioController from "../controllers/funcionarioController.js"
import Auth from "../middleware/Auth.js"

const funcionariosRoutes = express.Router()

funcionariosRoutes.get("/funcionarios", Auth.Authorization, funcionarioController.getAllFuncionarios)

funcionariosRoutes.post("/funcionario", Auth.Authorization, funcionarioController.createFuncionario)

funcionariosRoutes.delete("/funcionario/:id", Auth.Authorization, funcionarioController.deleteFuncionario)

funcionariosRoutes.put("/funcionario/:id", Auth.Authorization, funcionarioController.updateFuncionario)

funcionariosRoutes.get("/funcionario/:id", Auth.Authorization, funcionarioController.getOneFuncionario)

export default funcionariosRoutes