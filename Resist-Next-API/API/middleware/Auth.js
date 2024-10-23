import jwt from "jsonwebtoken"; // Importa a biblioteca jsonwebtoken para manipulação de tokens
import userController from "../controllers/userController.js"; // Importa o controlador de usuários

// Middleware de autorização
const Authorization = (req, res, next) => {
  // Obtém o token de autorização do cabeçalho da requisição
  const authToken = req.headers["authorization"];
  
  if (authToken) {
    // Divide o token em partes (Bearer e o token propriamente dito)
    const bearer = authToken.split(" ");
    
    // Verifica se o token está no formato correto (Bearer + token)
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.redirect('/login'); // Redireciona para /login se o formato estiver incorreto
    }

    // Extrai o token da string
    const token = bearer[1];
    
    // Verifica a validade do token
    jwt.verify(token, userController.JWTSecret, (error, decodedToken) => {
      if (error) {
        return res.redirect('/login'); // Redireciona para /login se o token não for válido
      }

      // Adiciona os dados do usuário decodificados à requisição
      req.loggedUser = {
        id: decodedToken.id, // ID do usuário decodificado
        email: decodedToken.email, // Email do usuário decodificado
      };

      // Passa para o próximo middleware ou rota
      next();
    });
  } else {
    // Redireciona para /login se nenhum token for fornecido
    res.redirect('/login');
  }
};

// Exporta o middleware de autorização
export default { Authorization };
