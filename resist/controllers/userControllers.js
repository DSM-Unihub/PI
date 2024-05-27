import express from 'express'
import bcrypt from 'bcrypt'
import connection from '../config/sequelize-config.js'
const router = express.Router()

router.get("/login", (req, res) => {
    res.render("login", {
        loggedOut: true,
    })
})

router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body
    try {
        const [rows] = await connection.query(`SELECT * FROM usuario where email = '${email}'`)
        if (rows.length > 0) {
            const user = rows[0]
            const correct = bcrypt.compareSync(password, user.senha)
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/")
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    } catch (error) {
        console.error('Erro ao conectar ao banco', error)
    }
})

router.get("/cadastro", function (req, res) {
    res.render("cadastro", {
        loggedOut: true,
    })
})

router.get("/createNew", async (req, res) => {
    const {
        instituicao,
        nomeFantasia,
        CNPJ,
        InscricaoEstadual,
        logadouro,
        numero,
        bairro,
        cidade,
        estado,
        telddd,
        telnumber,
        celddd,
        celnumber,
        email,
    } = req.body
try{

    const [rows] = await connection.query(`SELECT * FROM instituicao where cnpj = '${CNPJ}'`)
    if (rows.length === 0) {
        await connection.query(`INSERT INTO instituicao (instituicao, nomeFantasia, CNPJ, InscricaoEstadual, logadouro, numero, bairro, cidade, estado, telefone, celular, email) values ('${instituicao}', '${nomeFantasia}', '${CNPJ}', '${InscricaoEstadual}', '${logadouro}', '${numero}', '${bairro}', '${cidade}', '${estado}', '${telddd} ${telnumber}', '${celddd} ${celnumber}', '${email}');`)
        res.redirect("/login")
    }
}catch(erro){
    console.log(erro)
}
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

export default router