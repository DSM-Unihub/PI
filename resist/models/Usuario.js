import Sequelize from "sequelize";
import connection from "../config/sequelize-config";

const Usuario = connection.define('Usuario',{
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    celular:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    image:{
        type: Sequelize.STRING,
        allowNull: false
    }
})
Usuario.sync({force: false})
export default Usuario