import Sequelize from "sequelize";
import db from "../config/db.js";

export const Menu = db.define('menu', {
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
}, {
    timestamps: false,
    indexes: [
        {
            fields: ["date", "organizationId", "mealId"],
            unique: true,
        },
    ],
});
