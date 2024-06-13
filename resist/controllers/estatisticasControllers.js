import express from 'express'
import connection from '../config/sequelize-config.js'
import Auth from '../middleware/Auth.js'

const router = express.Router()

router.get("/estatisticas", Auth, async (req, res)=>{
    const [acessoxmes] = await connection.query("SELECT * FROM acessoxmes")
    console.log(acessoxmes)
        req.session.statisticas = acessoxmes.map(estatisticas => ({
            Dispositivo: estatisticas.tiipo_dispositivo,
            Laboratório: estatisticas.laboratorio,
            mes: estatisticas.mes_acesso,
            moveis: estatisticas.contagem_disp_movel,
            desktop
    })) 
    const estatisticasPorMes = [
        { 
            mes: 'Janeiro', 
            mobile: 38,
            desktop: 47,
            percent: 7
         },
        { 
            mes: 'Fevereiro', 
            mobile: 132,
            desktop: 61,
            percent: 37 
        },
        { 
            mes: 'Março', 
            mobile: 314,
            desktop: 190,
            percent: 41 
        },
        { 
            mes: 'Abril', 
            mobile: 228,
            desktop: 200,
            percent: 3 
        },
        { 
            mes: 'Maio', 
            mobile: 314,
            desktop: 67,
            percent: 5 
        },
        { 
            mes: 'Junho', 
            mobile: 171,
            desktop: 126,
            percent: 2 
        },
        { 
            mes: 'Julho', 
            mobile: 62,
            desktop: 26,
            percent: -68
        },
        { 
            mes: 'Agosto', 
            mobile: 141,
            desktop: 79,
            percent: 46
        },
        { 
            mes: 'Setembro',
            mobile: 279,
            desktop: 224,
            percent: 81
        },
        { 
            mes: 'Outubro', 
            mobile: 236,
            desktop: 164,
            percent: 12
        },
        { 
            mes: 'Novembro', 
            mobile: 86,
            desktop: 213,
            percent: 4 
        },
        { 
            mes: 'Dezembro', 
            mobile: 46,
            desktop: 12,
            percent: -43
         }
    ];

    res.render("estatisticas", {
        Mes: estatisticasPorMes,
        usuario: req.session.user
    })
})

export default router