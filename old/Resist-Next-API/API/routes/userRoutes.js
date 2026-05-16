import express from "express";
import userController from "../controllers/userController.js"
import authController from "../controllers/authController.js";
import Auth from '../middleware/Auth.js'
const router = express.Router()

// Rota para cadastrar um novo usuário
router.post("/user", userController.createUser);

// Rota para listar todos os usuários
router.get("/users", Auth, userController.getAllUsers);

// Rota para buscar um usuário por ID
router.get("/user/:id", Auth, userController.getUserById);

// Rota para atualizar um usuário
router.put("/user/:id", Auth, userController.updateUser);

// Rota para remover um usuário
router.delete("/user/:id", Auth, userController.deleteUser);

router.post('/login', authController.login);


export default router;
