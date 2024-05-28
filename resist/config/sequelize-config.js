import { Sequelize } from "sequelize";

const connection = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    port:3307,
    username: "root",
    password: "",
    database: "resistBD",
    timezone: "-03:00"
})

export default connection