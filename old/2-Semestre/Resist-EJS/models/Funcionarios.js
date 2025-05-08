import Sequelize  from "sequelize"
import connection from "../config/sequelize-config.js"

const Funcionarios = connection.define('funcionarios',{
    idFuncionario:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
	foto:{
        type: Sequelize.STRING,
        allowNull:false
    },
    nome:{
        type: Sequelize.STRING,
        allowNull:false
    },
    cpf:{
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull:false
    },
    rua:{
        type: Sequelize.STRING,
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
    idGrupo:{
        type: Sequelize.INTEGER,
        allowNull:true
    }
}, {
    timestamps: false
})

Funcionarios.sync({force:false})
export default Funcionarios