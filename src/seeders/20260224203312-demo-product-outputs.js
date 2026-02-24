'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductOutputs', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        productId: '44c10756-68bb-4d40-9a06-ed5f266f3a5f',
        quantity: 5,
        unitPrice: 30,
        totalValue: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ProductOutputs', null, {});
  },
};