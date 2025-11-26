'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('meals', [
      { id: 1, name: 'Desayuno' },
      { id: 2, name: 'Almuerzo' },
      { id: 3, name: 'Cena' }
    ], {});

    // Reset sequence to max id + 1
    await queryInterface.sequelize.query(
      `SELECT setval('meals_id_seq', (SELECT MAX(id) FROM meals));`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('meals', null, {});
  }
};
