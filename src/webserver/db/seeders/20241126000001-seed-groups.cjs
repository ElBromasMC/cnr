'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('groups', [
      {
        id: 1,
        name: 'admin',
        description: 'The administrator group',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'public',
        description: 'The public group',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Reset sequence to max id + 1
    await queryInterface.sequelize.query(
      `SELECT setval('groups_id_seq', (SELECT MAX(id) FROM groups));`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('groups', null, {});
  }
};
