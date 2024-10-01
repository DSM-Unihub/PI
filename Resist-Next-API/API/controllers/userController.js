import jwt from "jsonwebtoken";
import userService from "../services/userService.js";
import dotenv from "dotenv";



dotenv.config();

const JWTSecret = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (email != undefined) {
      const user = await userService.getOne(email);
      if (user != undefined) {
        if (user.senha == senha) {
          jwt.sign(
            {
              id: user._id,
              email: user.email,
            },
            JWTSecret,
            {
              expiresIn: "48h",
            },
            (error, token) => {
              if (error) {
                res.status(400);
                res.json({ error: "Falha Interna!" });
              } else {
                res.status(200);
                res.json({ token: token });
              }
            }
          );
        } else {
          res.status(401);
          res.json({ error: "Credenciais Inválidas!" });
        }
      } else {
        res.status(404);
        res.json({ error: "O email enviado não foi encontrado!" });
      }
    } else {
      res.status(400);
      res.json({ error: "O Email enviado é invalido!" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};


export default { loginUser, JWTSecret };
