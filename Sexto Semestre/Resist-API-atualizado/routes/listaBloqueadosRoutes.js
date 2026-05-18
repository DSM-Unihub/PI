import express from "express";
import listaBloqueadosController from "../controllers/listaBloqueadosController.js";
import Auth, { authorizeRoles } from "../middleware/Auth.js";

const router = express.Router();

// bloqueados.txt — proxy / legado
router.get(
  "/listas/bloqueados",
  Auth,
  authorizeRoles(0),
  listaBloqueadosController.listBloqueados
);
router.get(
  "/listas/bloqueados/entrada",
  Auth,
  authorizeRoles(0),
  listaBloqueadosController.getBloqueado
);
router.post(
  "/listas/bloqueados",
  Auth,
  authorizeRoles(1),
  listaBloqueadosController.addBloqueado
);
router.delete(
  "/listas/bloqueados",
  Auth,
  authorizeRoles(1),
  listaBloqueadosController.removeBloqueado
);

// bloqueados_total.txt — mitm / bloqueio total
router.get(
  "/listas/bloqueados-total",
  Auth,
  authorizeRoles(0),
  listaBloqueadosController.listBloqueadosTotal
);
router.get(
  "/listas/bloqueados-total/entrada",
  Auth,
  authorizeRoles(0),
  listaBloqueadosController.getBloqueadoTotal
);
router.post(
  "/listas/bloqueados-total",
  Auth,
  authorizeRoles(1),
  listaBloqueadosController.addBloqueadoTotal
);
router.delete(
  "/listas/bloqueados-total",
  Auth,
  authorizeRoles(1),
  listaBloqueadosController.removeBloqueadoTotal
);

export default router;
