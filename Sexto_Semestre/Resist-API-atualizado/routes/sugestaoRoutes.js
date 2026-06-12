import express from 'express';
import sugestaoController from '../controllers/sugestaoController.js';
import Auth, { authorizeRoles } from '../middleware/Auth.js'

const router = express.Router();

router.post('/sugestao', Auth, authorizeRoles(0), sugestaoController.createSugestao)
router.get('/sugestao', Auth, authorizeRoles(0), sugestaoController.getAllSugestao)
router.get('/sugestao/:id', Auth, authorizeRoles(0), sugestaoController.getOneSugestao)
router.patch('/sugestao/:id', Auth, authorizeRoles(1), sugestaoController.updateSugestao)

export default router;