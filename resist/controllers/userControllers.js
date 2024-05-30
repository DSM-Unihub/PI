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
        const [rows] = await connection.query(`SELECT * FROM funcionariosXemails where email = '${email}'`)
        if (rows.length > 0) {
            const user = rows[0]
            const correct = password == user.senha
            if (correct) {
                req.session.user = {
                    id: user.idFuncionario,
                    email: user.email,
                }
                res.redirect("/")
            } else {
                res.send("Senha incorreta")
                //res.redirect("/login")
            }
        } else {
            res.send("Usuario não encontrado")
            //res.redirect("/login")
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

router.post("/cadastro/new", async (req, res) => {
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
    const [rows] = await connection.query(`SELECT * FROM instituicoes where cnpj = '${CNPJ}'`)
    if (rows.length === 0) {
        
        await connection.query(`INSERT INTO instituicoes (razaoSocial, CNPJ, InscricaoEstadual, logradouro, numero, bairro, cidade, estado) values ('${nomeFantasia}', '${CNPJ}', '${InscricaoEstadual}', '${logadouro}', '${numero}', '${bairro}', '${cidade}', '${estado}');`)
        
        const [rows] = await connection.query(`SELECT idInstituicao FROM instituicoes where cnpj = '${CNPJ}'`)
        
        const inst = rows[0]
        
        const idInstituicao = inst.idInstituicao
        
        await connection.query(`INSERT INTO instXtelefones(telefone, idInstituicao) VALUES ('(${telddd}) ${telnumber}, ${idInstituicao}'), ('(${celddd}) ${celnumber}, ${idInstituicao}')`)
        
        await connection.query(`INSERT INTO instXemails(email, idInstituicao) VALUES ('${email}, ${idInstituicao}'),`)
        
        // await connection.query(`INSERT INTO funcionarios(nome, cpf, rua, bairro,  ) VALUES ('${}, ${}'),`)



        res.send("OLa")
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