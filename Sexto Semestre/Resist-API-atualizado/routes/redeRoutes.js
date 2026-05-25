import express from "express";
import redeController from "../controllers/redeController.js";
import Auth, { authorizeRoles } from "../middleware/Auth.js";

const router = express.Router();

router.post("/rede", Auth, authorizeRoles(1), redeController.createRede);
router.get("/rede", Auth, authorizeRoles(1), redeController.getAllRede);
router.delete("/rede/:id", Auth, authorizeRoles(1), redeController.deleteRede);

export default router;
