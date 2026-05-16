import express from 'express'
import connection from '../config/sequelize-config.js'
import Auth from '../middleware/Auth.js'

const router = express.Router()
const getMonthName = (monthNumber) => {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[monthNumber - 1]; // O índice do array começa em 0, então subtraímos 1
};

router.get("/estatisticas", Auth, async (req, res)=>{
    const [acessoxmes] = await connection.query("SELECT * FROM acessoxmes")
        req.session.statisticas = acessoxmes.map(estatisticas => ({
            Dispositivo: estatisticas.tipo_dispositivo,
            Laboratório: estatisticas.laboratorio,
            mes: getMonthName(estatisticas.mes_acesso),
            mobile: estatisticas.contagem_disp_movel,
            desktop: estatisticas.contagem_desktop,
            percent: estatisticas.variacao_perc_acessos_bloqueados
            })) 
    res.render("estatisticas", {
        usuario: req.session.user,
        Mes: req.session.statisticas,
        })
        })

export default router