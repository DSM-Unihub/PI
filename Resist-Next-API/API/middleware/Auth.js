import jwt from "jsonwebtoken";
import userController from "../controllers/userController.js";

const Authorization = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    jwt.verify(token, userController.JWTSecret, (error, data) => {
      if (error) {
        res.status(401);
        res.json({ error: "Token Inavlido!" });
      } else {
        req.token = tokenreq.LoggedUser = {
          id: data.id,
          email: data.email,
        };
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ error: "Token Invalido!" });
  }
};

// Middleware para verificar se o token é válido antes de cada requisição

export default { Authorization };
