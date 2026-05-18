import express from "express";
import logController from "../controllers/logController.js";
import Auth, { authorizeRoles } from "../middleware/Auth.js";

const router = express.Router();

// Buscar todos os logs
router.get("/logs", Auth, authorizeRoles(1), logController.getAllLogs);

// Buscar log específico por ID
router.get("/logs/:id", Auth, authorizeRoles(1), logController.getLogById);

export default router;
