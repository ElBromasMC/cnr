import Sequelize from "sequelize";
import db from "../config/db.js";

export const Type = db.define("type", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    timestamps: false,
});
