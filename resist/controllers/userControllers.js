import express from 'express'

const router = express.Router()

router.get("/login", (req, res)=>{
    res.render("login")
})
router.get("/cadastro", function(req, res){
    res.render("cadastro")
})

export default router