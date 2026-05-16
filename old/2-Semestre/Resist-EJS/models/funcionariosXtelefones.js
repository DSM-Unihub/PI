import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const funcionariosXtelefones = connection.define('funcionariosXtelefones',{
    idFuncXtelefone:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
	telefone:{
        type: Sequelize.STRING,
        allowNull:false
    },
    idFuncionario:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
}, {
    timestamps: false
})
funcionariosXtelefones.sync({force:false})
export default funcionariosXtelefones
