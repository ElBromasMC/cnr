'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping admin user creation.');
      return;
    }

    // Check if admin already exists
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = :email`,
      {
        replacements: { email: adminEmail },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists. Skipping creation.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        phone: null,
        token: null,
        confirmed: true,
        groupId: 1,
        organizationId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    console.log(`Admin user created with email: ${adminEmail}`);
  },

  async down(queryInterface, Sequelize) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await queryInterface.bulkDelete('users', { email: adminEmail }, {});
    }
  }
};
