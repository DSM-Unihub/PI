import express from "express";
import userController from "../controllers/userController.js";
import { body, validationResult } from "express-validator"; // Importando validações

const userRoutes = express.Router();

// Rota de login com validação de entrada
userRoutes.post(
  "/auth",
  [
    body("email").isEmail().withMessage("O email deve ser válido."),
    body("password").notEmpty().withMessage("A senha é obrigatória.")
  ],
  async (req, res) => {
    // Validando entradas
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Chama o controlador para fazer o login
    await userController.loginUser(req, res);
  }
);

export default userRoutes;
