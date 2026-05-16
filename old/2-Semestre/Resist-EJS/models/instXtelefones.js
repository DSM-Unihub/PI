import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const instXtelefones = connection.define('instXtelefones',{
    idInstXtelefone:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
	telefone:{
        type: Sequelize.STRING,
        allowNull:false
    },
    idInstituicao:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
}, {
    timestamps: false
})
instXtelefones.sync({force:false})
export default instXtelefones
