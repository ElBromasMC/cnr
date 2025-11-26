import Sequelize from "sequelize";
import db from "../config/db.js";

export const Organization = db.define('organization', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});
