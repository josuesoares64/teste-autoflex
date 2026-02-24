'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const products = Array.from({ length: 10 }).map((_, i) => ({
      id: uuidv4(),
      code: `PR-${String(i + 1).padStart(3, '0')}`,
      name: `Produto ${i + 1}`,
      price: (Math.random() * 50 + 10).toFixed(2),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Products', products);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};