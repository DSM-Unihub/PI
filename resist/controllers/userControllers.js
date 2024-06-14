import express from 'express'
import bcrypt from 'bcrypt'
import Funcionarios from '../models/Funcionarios.js'
import Instituicoes from '../models/Instituicoes.js'
import Auth from '../middleware/Auth.js'
import instXemails from '../models/instXemails.js'
import instXtelefones from '../models/instXtelefones.js'
import funcXinstituicoes from '../models/funcXinstituicoes.js'
import funcionariosXtelefones from '../models/funcionariosXtelefones.js'
import multer from 'multer';
import connection from '../config/sequelize-config.js'
const upload = multer({dest: "public/imgs"})
const router = express.Router()

router.get("/login", (req, res) => {
    res.render("login", {
        loggedOut: true,
    })
})

router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body
    Funcionarios.findOne({
        where: { email: email }
    }).then(user => {
        if (user != undefined) {
            const correct = bcrypt.compareSync(password, user.senha)
            if (correct) {
                const [instituicao] = await connection.query(`SELECT idInstituicao from funcXinstituicoes where idFuncionario = ${req.session.user.id}`)
                req.session.user = {
                    id: user.idFuncionario,
                    foto: user.foto,
                    nome: user.nome,
                    email: user.email,
                    grupo: user.idgrupo,
                    idInst: instituicao[0].idInstituicao
                    }
                //req.flash("success", "Login efetuado com sucesso!")
                res.redirect("/")
            } else {
                //req.flash('danger','Senha Incorreta!')
                res.redirect("/login")
            }
        } else {
            //req.flash('danger','Usuario não encontrado!')
            res.redirect("/login")
        }
    })
})

router.get("/usuarios", Auth, async (req, res)=>{
    res.render("usuarios",{
        usuario: req.session.user
    })
})

router.get("/cadastro", function (req, res) {
    res.render("cadastro", {
        loggedOut: true,
    })
})

router.post("/cadastro/new", upload.single("fotoPerfil"), async (req, res) => {
    const {
        instituicao,
        nomeFantasia,
        CNPJ,
        InscricaoEstadual,
        logradouro,
        numero,
        bairro,
        cidade,
        estado,
        telddd,
        telnumber,
        celddd,
        celnumber,
        email,
        userName,
        userCpf,
        userMail,
        userPassword,
        logradouroUser,
        bairroUser,
        cidadeUser,
        estadoUser,
        userCelddd,
        userCelNumber
    } = req.body

   try {
        let inst = await Instituicoes.findOne({ where: { cnpj: CNPJ } });
        if (!inst) {
            inst = await Instituicoes.create({
                razaoSocial: nomeFantasia,
                cnpj: CNPJ,
                inscricaoEstadual: InscricaoEstadual,
                logradouro: logradouro,
                numero: numero,
                bairro: bairro,
                cidade: cidade,
                estado: estado
            });
            await instXemails.create({ 
                email: email, 
                idInstituicao: inst.idInstituicao 
            });
            await instXtelefones.create({ 
                telefone: `(${telddd}) ${telnumber}`, 
                idInstituicao: inst.idInstituicao 
            });
            await instXtelefones.create({ 
                telefone: `(${celddd}) ${celnumber}`, 
                idInstituicao: inst.idInstituicao 
            });
        }

        let usu = await Funcionarios.findOne({ where: { email: userMail } });
        if (!usu) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(userPassword,salt);
            usu = await Funcionarios.create({
                foto: '/imgs/defaultUser.png',
                nome: userName,
                cpf: userCpf,
                email: userMail,
                senha: hash,
                rua: logradouroUser,
                bairro: bairroUser,
                cidade: cidadeUser,
                estado: estadoUser,
                idGrupo: 1
            });
            await funcionariosXtelefones.create({ 
                telefone: `(${userCelddd}) ${userCelNumber}`, 
                idFuncionario: usu.idFuncionario 
            });
            await funcXinstituicoes.create({ 
                idInstituicao: inst.idInstituicao, 
                idFuncionario: usu.idFuncionario 
            });
        }
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.redirect("/cadastro");
    }
});
    router.get("/logout", (req, res) => {
        req.session.user = undefined
        res.redirect("/")
    })



    export default router

