import express from "express";
import userController from "../controllers/userController.js"
import authController from "../controllers/authController.js";
import Auth, { authorizeRoles } from '../middleware/Auth.js'
import multer from "multer";
const router = express.Router()

const upload = multer({
  dest: "uploads/",
});

// Rota para cadastrar um novo usuário
router.post("/user", upload.single("foto"), userController.createUser);

// Rota para listar todos os usuários
router.get("/users", Auth, authorizeRoles(1), userController.getAllUsers);

// Rota para buscar um usuário por ID
router.get("/user/:id", Auth, authorizeRoles(1), userController.getUserById);

// Rota para atualizar um usuário
router.put("/user/:id", Auth, authorizeRoles(1), userController.updateUser);

// Rota para remover um usuário
router.delete("/user/:id", Auth, authorizeRoles(2), userController.deleteUser);


router.post('/login', authController.login);


router.get('/user/sugestoes/:id', Auth, authorizeRoles(0), userController.getUserSugestions)

export default router;
