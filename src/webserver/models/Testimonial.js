import Sequelize from "sequelize";
import db from "../config/db.js";

export const Testimonial = db.define('testimonial', {
    message: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    rating: {
        type: Sequelize.SMALLINT,
        validate: { min: 1, max: 5 },
        allowNull: false,
    },
}, {
    timestamps: false,
});
