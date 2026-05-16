import express from 'express'
import Auth from '../middleware/Auth.js'
import connection from '../config/sequelize-config.js'

const router = express.Router()

function ordenacaoLexicograficaRecursiva(arr) {
    if (arr.length <= 1) {
        return arr;
    } else {
        const pivot = arr[0];
        const menores = [];
        const iguais = [];
        const maiores = [];

        for (let str of arr) {
            if (str < pivot) {
                menores.push(str);
            } else if (str === pivot) {
                iguais.push(str);
            } else {
                maiores.push(str);
            }
        }

        return ordenacaoLexicograficaRecursiva(menores).concat(iguais, ordenacaoLexicograficaRecursiva(maiores));
    }
}


router.get("/bloqueios", Auth, async(req, res)=>{
    try {
        const [bloq] = await connection.query('SELECT * FROM bloqueio');        
        res.render('bloqueios', {
            usuario: req.session.user,
            bloq: bloq
        })
    } catch (error) {
        console.error('Erro ao buscar bloqueios:', error);
        res.status(500).send('Erro ao buscar bloqueios');
    }
})
export default router