import Sequelize from "sequelize";
import connection from "../config/sequelize-config";

const Empresa = connection.define('Empresa',{
    tpInstituicao:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nomeFantasia:{
        type: Sequelize.STRING,
        allowNull: false
    },
    CNPJ:{
        type: Sequelize.STRING,
        allowNull: false
    },
    inscricaoEstadual:{
        type: Sequelize.STRING,
        allowNull: false
    },
    logadouro:{
        type: Sequelize.STRING,
        allowNull: false
    },
    numero:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    bairro:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cidade:{
        type: Sequelize.STRING,
        allowNull: false
    },
    estado:{
        type: Sequelize.STRING,
        allowNull: false
    },
    telefone:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    celular:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },

})
Empresa.sync({force: false})
export default Empresa