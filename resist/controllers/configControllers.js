import express from 'express'
import Auth from '../middleware/Auth.js'
const router = express.Router()

router.get("/config", Auth, (req, res) => {
    res.render("config", {
        loggedOut: true,
    })
})

router.get("/configUSer", Auth, (req, res)=>{
    res.render("configUSer",{
        loggedOut: true
    })
})
export default router