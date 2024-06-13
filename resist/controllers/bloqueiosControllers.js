import express from 'express'
import Auth from '../middleware/Auth.js'

const router = express.Router()

router.get("/bloqueios", Auth, (req, res)=>{
    res.render("bloqueios", {
        usuario: req.session.user
    })
})

export default router