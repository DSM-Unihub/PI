import Sequelize  from "sequelize"
import connection from "../config/sequelize-config.js"

const Instituicoes = connection.define('instituicoes',{
    idInstituicao:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
	razaoSocial:{
        type: Sequelize.STRING,
        allowNull:false
    },
    cnpj:{
        type: Sequelize.STRING,
        allowNull:false
    },
    inscricaoEstadual:{
        type: Sequelize.STRING,
        allowNull:false
    },
    logradouro:{
        type: Sequelize.STRING,
        allowNull:false
    },
    numero:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    bairro:{
        type: Sequelize.STRING,
        allowNull:false
    },
    cidade:{
        type: Sequelize.STRING,
        allowNull:false
    },
    estado:{
        type: Sequelize.STRING,
        allowNull:false
    },
}, {
    timestamps: false
})
Instituicoes.sync({force:false})
export default Instituicoes