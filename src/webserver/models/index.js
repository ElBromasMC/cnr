import db from "../config/db.js";
import bcrypt from "bcryptjs";

import { User } from "./User.js";
import { Organization } from "./Organization.js";
import { Group } from "./Group.js";

import { Menu } from "./Menu.js"
import { Content } from "./Content.js"
import { Type } from "./Type.js"
import { Meal } from "./Meal.js";

import { Testimonial } from "./Testimonial.js"

// Methods
User.prototype.checkPassword = async function (formPassword) {
    return await bcrypt.compare(formPassword, this.password);
}


User.beforeValidate(async (user, options) => {
    if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Relationships
// Group has many Users
Group.hasMany(User, {
    foreignKey: {
        allowNull: false,
        defaultValue: 2,
    }
});
User.belongsTo(Group);

// Organization has many Users
Organization.hasMany(User);
User.belongsTo(Organization);

// Organization has many Menus
Organization.hasMany(Menu);
Menu.belongsTo(Organization, {
    foreignKey: {
        allowNull: false,
        defaultValue: 1,
    }
});

// Meal has many Menus
Meal.hasMany(Menu, {
    foreignKey: {
        allowNull: false,
    }
});
Menu.belongsTo(Meal);

// Menus (many to many) contents
Menu.belongsToMany(Content, { through: "MenuContent" })
Content.belongsToMany(Menu, { through: "MenuContent" })

// Type has many Contents
Type.hasMany(Content, {
    foreignKey: {
        allowNull: false,
    }
});
Content.belongsTo(Type);

/*
// User has many Testimonials
User.hasMany(Testimonial);
Testimonial.belongsTo(User);
*/

// Menu has many Testimonials
Menu.hasMany(Testimonial, {
    foreignKey: {
        allowNull: false,
    }
});
Testimonial.belongsTo(Menu);

export default db;
