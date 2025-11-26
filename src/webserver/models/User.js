import Sequelize from "sequelize";
import db from "../config/db.js";
import generateID from "../helpers/generateID.js";

export const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    token: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: generateID(),
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: true,
});
