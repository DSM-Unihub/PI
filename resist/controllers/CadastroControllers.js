import express from 'express'

const router = express.Router()

router.get("/cadastro", function(req, res){
    res.render("cadastro")
})

export default router