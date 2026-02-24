'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const rawMaterials = Array.from({ length: 10 }).map((_, i) => ({
      id: uuidv4(),
      code: `RM-${String(i + 1).padStart(3, '0')}`,
      name: `Matéria Prima ${i + 1}`,
      stockQuantity: (Math.random() * 100).toFixed(2),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('RawMaterials', rawMaterials);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('RawMaterials', null, {});
  }
};