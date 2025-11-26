import Sequelize from "sequelize";
import db from "../config/db.js";

export const Content = db.define("content", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    indexes: [
        {
            fields: ["name", "typeId"],
            unique: true,
        },
    ],
});
