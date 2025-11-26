import Sequelize from "sequelize";

const db = new Sequelize(process.env.POSTGRESQL_URL, {
    dialect: 'postgres',
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
});

export default db;
