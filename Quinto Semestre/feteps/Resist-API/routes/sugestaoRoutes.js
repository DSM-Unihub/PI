import express from 'express';
import sugestaoController from '../controllers/sugestaoController.js';

const router = express.Router();

router.post('/sugestao', sugestaoController.createSugestao)
router.get('/sugestao', sugestaoController.getAllSugestao)
router.get('/sugestao/:id', sugestaoController.getOneSugestao)
router.patch('/sugestao/:id', sugestaoController.updateSugestao)

export default router;