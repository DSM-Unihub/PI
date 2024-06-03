import express from 'express'
import bcrypt from 'bcrypt'
import Funcionarios from '../models/Funcionarios.js'
import Instituicoes from '../models/Instituicoes.js'
import instXemails from '../models/instXemails.js'
import instXtelefones from '../models/instXtelefones.js'
import funcXinstituicoes from '../models/funcXinstituicoes.js'
import funcionariosXtelefones from '../models/funcionariosXtelefones.js'
import Auth from '../middleware/Auth.js'

const router = express.Router()

router.get("/estatisticas", Auth, (req, res)=>{
    res.render("estatisticas",{
        usuario: req.session.user
    })
})

export default router