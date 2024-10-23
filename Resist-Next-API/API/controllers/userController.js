import jwt from "jsonwebtoken";
import userService from "../services/userService.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const JWTSecret = process.env.JWT_SECRET || "defaultSecret";

// Função auxiliar para enviar respostas de erro
const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

// Função de login do usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validação de entrada
  if (!email || !password) {
    return sendErrorResponse(res, 400, "Email e senha são obrigatórios!");
  }

  try {
    const user = await userService.getOne(email);
    if (!user) {
      return sendErrorResponse(res, 404, "O email enviado não foi encontrado!");
    }

    // Verifica a validade da senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, "Credenciais Inválidas!");
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWTSecret,
      { expiresIn: "48h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erro de login:", error);
    return sendErrorResponse(res, 500, "Falha Interna!");
  }
};

// Exporta a função de login e a constante JWTSecret
export default { loginUser, JWTSecret };
