import express from "express";
import redeController from "../controllers/redeController.js";
import Auth, { authorizeRoles } from "../middleware/Auth.js";

const router = express.Router();

router.post("/rede", Auth, authorizeRoles(1), redeController.createRede);
router.get("/rede", Auth, authorizeRoles(1), redeController.getAllRede);
router.delete("/rede/:id", Auth, authorizeRoles(1), redeController.deleteRede);
router.get("/rede/incidencia",Auth,authorizeRoles(1),redeController.getIncidenciaRede);
router.get(
  "/rede/estatisticas-bloqueios",
  Auth,
  authorizeRoles(1),
  redeController.getEstatisticasBloqueios
);
router.get(
  "/rede/ultimos-bloqueios",
  Auth,
  authorizeRoles(1),
  redeController.getUltimosBloqueios
); 
export default router;
