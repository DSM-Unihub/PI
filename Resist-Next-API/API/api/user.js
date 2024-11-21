import connectDB from "../config/db-connection.js";
import express from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
import Auth from "../middleware/Auth.js";

const app = express();
app.use(express.json());

app.post("/user", userController.createUser);
app.get("/users", Auth, userController.getAllUsers);
app.get("/user/:id", Auth, userController.getUserById);
app.put("/user/:id", Auth, userController.updateUser);
app.delete("/user/:id", Auth, userController.deleteUser);
app.post("/login", authController.login);

export default async (req, res) => {
  await connectDB(); // Garante a conexão com o banco de dados
  return app(req, res);
};
