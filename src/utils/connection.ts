import { Sequelize } from "sequelize";



export const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    username: "myuser",
    password: "mypassword",
    database: "dev_db",
    port: 5432,
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000
    },
    sync: { force: true },
})


