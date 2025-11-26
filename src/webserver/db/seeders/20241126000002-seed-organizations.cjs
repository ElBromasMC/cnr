'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organizations', [
      {
        id: 1,
        name: 'public',
        description: 'Public organization',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Reset sequence to max id + 1
    await queryInterface.sequelize.query(
      `SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations));`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organizations', null, {});
  }
};
