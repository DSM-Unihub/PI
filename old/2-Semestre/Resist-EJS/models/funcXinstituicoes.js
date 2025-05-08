import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const funcXinstituicoes = connection.define('funcXinstituicoes',{
    idFuncXinstituicao:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
	idInstituicao:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    idFuncionario:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
}, {
    timestamps: false
})
funcXinstituicoes.sync({force:false})
export default funcXinstituicoes
