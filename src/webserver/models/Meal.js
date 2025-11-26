import Sequelize from "sequelize";
import db from "../config/db.js";

export const Meal = db.define('meal', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
});
