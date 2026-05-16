import express from 'express'
import sugestaoController from '../controllers/sugestaoController.js'
// import sugestaoController from '../controllers/sugestaoController'
import Auth from '../middleware/Auth.js'
const router = express.Router()

router.post('/sugestao',sugestaoController.createSugestao)
router.get('/sugestao', sugestaoController.getAllSugestao)
router.get('/sugestao/:id', sugestaoController.getOneSugestao)
router.put('/sugestao/:id', sugestaoController.updateSugestao)
export default router;