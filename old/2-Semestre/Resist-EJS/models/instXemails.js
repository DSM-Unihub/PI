import { Sequelize } from "sequelize";
import connection from "../config/sequelize-config.js";

const instXemails = connection.define('instXemails',{
    idInstXemail:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement: true
    },
	email:{
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
instXemails.sync({force:false})
export default instXemails
