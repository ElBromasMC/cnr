'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('types', [
      { id: 2, name: 'Entrada' },
      { id: 3, name: 'P. Fondo' },
      { id: 4, name: 'Bebida' },
      { id: 5, name: 'Postre' },
      { id: 7, name: 'Desayuno' },
      { id: 8, name: 'Cena' }
    ], {});

    // Reset sequence to max id + 1
    await queryInterface.sequelize.query(
      `SELECT setval('types_id_seq', (SELECT MAX(id) FROM types));`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('types', null, {});
  }
};
